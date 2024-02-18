from flask_cors import CORS, cross_origin
from flask import Flask, flash, redirect, request, session, url_for, jsonify
from mod_match import final_similarity, load_audio_features
from parody_match import predict, ParodyLSTM
from lyric_extraction import transcribe_audio
import requests
app = Flask(__name__)
CORS(app)
FILE_PATH1 = 'local1.mp3'
FILE_PATH2 = 'local2.mp3'
@app.route('/ml/', methods=['POST'])
def entry():
    url1 = request.get_json()['url1']
    url2 = request.get_json()['url2']

    response1 = requests.get(url1)
    response2 = requests.get(url2)

    if response1.status_code == 200 == response2.status_code:
    # Write the audio content to a local file
        with open(FILE_PATH1, 'wb') as audio_file:
            audio_file.write(response1.content)
        print(f"Audio file downloaded and saved as {FILE_PATH1}")

        with open(FILE_PATH2, 'wb') as audio_file:
            audio_file.write(response2.content)
        print(f"Audio file downloaded and saved as {FILE_PATH2}")

    else:
        print(f"Failed to download audio file. Status code: {response.status_code}")
        return

    lyrics1 = transcribe_audio(FILE_PATH1)
    lyrics2 = transcribe_audio(FILE_PATH2)
    

    features1 = load_audio_features(FILE_PATH1, lyrics1)
    features2 = load_audio_features(FILE_PATH2, lyrics2)
    similarity_mod = final_similarity(features1, features2)

        
    similarity_parody = predict(lyrics1, lyrics2).item()
    with open('new_songs.txt', 'a') as file:
        file.write(lyrics1 + '\n---\n`')
        file.write(lyrics2)
    return jsonify(
        {
            'similarity_parody': similarity_parody,
            'similarity_mod': similarity_mod
            }
    )


if __name__ == '__main__':
    # Threaded option to enable multiple instances for multiple user access support
    app.run(threaded=True, port=5000)