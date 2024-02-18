import torch
import torch.nn as nn
import torch.optim as optim
import cohere
import os
import numpy as np
import spacy
from youtube_dl import YoutubeDL
import google_auth_oauthlib.flow
import googleapiclient.discovery
import googleapiclient.errors

scopes = ["https://www.googleapis.com/auth/youtube.force-ssl"]

api_key = os.environ.get("COHERE_API_KEY")
co = cohere.Client(api_key)
nlp = spacy.load("en_core_web_sm")

def load_file(path):
    # Open the file and read the lines

    with open(path, 'r', encoding='utf-8') as file:
        content = file.read()
        lines = content.split('---')

    return [song.strip() for song in lines]

def check_youtube(file_path):
    lyrics1 = transcribe_audio(file_path)
    features1 = load_audio_features(file_path, lyrics1)
    keywords = get_keywords(lyrics)


    # Disable OAuthlib's HTTPS verification when running locally.
    # *DO NOT* leave this option enabled in production.
    os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

    api_service_name = "youtube"
    api_version = "v3"

    # Get credentials and create an API client
    flow = google_auth_oauthlib.flow.InstalledAppFlow.from_client_secrets_file(
        client_secrets_file, scopes)
    credentials = flow.run_console()
    youtube = googleapiclient.discovery.build(
        api_service_name, api_version, credentials=credentials)

    request = youtube.search().list(
        part="snippet",
        q=f"{keywords}"
    )
    response = request.execute()
    flagged = []
    for i in range(len(response['items'])):
        item = response['items'][i]
        if kind == 'youtube#video':
            video_id = item['id']['videoId']
            url = f'https://www.youtube.com/watch?v={video_id}'

            ydl_opts = {
                'format': 'bestaudio/best',
                'postprocessors': [{
                    'key': 'FFmpegExtractAudio',
                    'preferredcodec': 'mp3',
                    'preferredquality': '192',
                }],
                'postprocessor_args': [
                    '-ar', '16000'
                ],
                'prefer_ffmpeg': True,
                'keepvideo': False,
            }

            with YoutubeDL(ydl_opts) as ydl:
                yt_path = f'yt{i}.mp3'
                ydl.download([yt_path])
                lyrics2 = transcribe_audio(yt_path)
                features2 = load_audio_features(yt_path, lyrics2)

                similarity_mod = final_similarity(features1, features2)
        
                similarity_parody = predict(lyrics1, lyrics2).item()

                if max(similarity_mod, similarity_parody) > 0.8:
                    flagged.append(url)
    return flagged


            



def get_keywords(lyrics):
    response = co.chat(
    model="command",
    message=f"Give me a phrase to encapsulate these song lyrics: {lyrics}",

    temperature=0.0, 
    prompt_truncation="OFF", 
    stream=False,
    )
    return response.text


def embed_lyrics(lyrics):

    # first chunk lyrics
    doc = nlp(lyrics)
    sentences = [sent.text for sent in doc.sents]
    embeddings = np.array(co.embed(sentences, model='embed-english-v2.0').embeddings)
    return embeddings


class ParodyLSTM(nn.Module):
    def __init__(self, embedding_dim, hidden_dim):
        super(ParodyLSTM, self).__init__()
        
        # Define the LSTM layers for each input
        self.lstm1 = nn.LSTM(embedding_dim, hidden_dim, batch_first=True)
        self.lstm2 = nn.LSTM(embedding_dim, hidden_dim, batch_first=True)
        
        # Define the fully connected layer for classification
        self.fc = nn.Linear(2 * hidden_dim, 1)  # Factor of 2 for concatenation
        
        # Define sigmoid activation for output
        self.sigmoid = nn.Sigmoid()

    def forward(self, input1, input2):
        input1, input2 = torch.tensor(input1, dtype=torch.float32), torch.tensor(input2, dtype=torch.float32)
        input1 = input1.view(input1.shape[0], 1, -1)
        input2 = input2.view(input2.shape[0], 1, -1)
     
        # Process each input through its respective LSTM
        output1, (hidden1, cell1) = self.lstm1(input1)
        output2, (hidden2, cell2) = self.lstm2(input2)
        pooled1 = torch.mean(output1, dim=0)
        pooled2 = torch.mean(output2, dim=0)
           
        # Combine the outputs of the two LSTMs
        combined = torch.cat((pooled1, pooled2), dim=1)
        
        # Pass the combined LSTM outputs through the fully connected layer
        out = self.fc(combined)
        
        # Apply sigmoid to get a probability score
        prob = self.sigmoid(out)

        return prob[0][0]

EMBEDDING_DIM = 4096
HIDDEN_DIM = 128
model = ParodyLSTM(EMBEDDING_DIM, HIDDEN_DIM)
loss_function = nn.BCELoss()
optimizer = optim.SGD(model.parameters(), lr=0.01)

def add_data(file1, file2, match, training_data):
    og, parody = load_file(file1), load_file(file2)
    og_embed = [embed_lyrics(song) for song in og]
    parody_embed = [embed_lyrics(song) for song in parody]

    for i in range(len(og_embed)):
        training_data.append([og_embed[i], parody_embed[i], match])

def train():

    training_data = []
    print(2)
    add_data('original.txt', 'parody.txt', 1, training_data)
    add_data('og_false.txt', 'parody_false.txt', 0, training_data)

    for epoch in range(300):  # again, normally you would NOT do 300 epochs, it is toy data
        for i in range(len(training_data)):
            print(epoch)
            og, parody, match = training_data[i]
            # Step 1. Remember that Pytorch accumulates gradients.
            # We need to clear them out before each instance
            model.zero_grad()

            # Step 3. Run our forward pass.
            prediction_prob = model(og, parody)

            # Step 4. Compute the loss, gradients, and update the parameters by
            #  calling optimizer.step()
            loss = loss_function(prediction_prob, torch.tensor(match, dtype=torch.float32))

            loss.backward()
            optimizer.step()
    torch.save(model, 'model.pth')



def predict(lyrics1, lyrics2):
    with torch.no_grad():
        model = torch.load('ml/model.pth')
        model.eval()  # Set the model to evaluation mode
        og_embed = embed_lyrics(lyrics1)
        parody_embed = embed_lyrics(lyrics2)
        return model(og_embed, parody_embed)



def test_lyrics(path1, path2):
    song1 = load_file(path1)[2]
    song2 = load_file(path1)[2]
    print(predict(song1, song2))



# test_lyrics('parody.txt', 'original.txt')
