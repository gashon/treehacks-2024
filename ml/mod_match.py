import librosa
import numpy as np
from scipy.spatial.distance import euclidean, cosine
import eyed3
import requests
from parody_match import embed_lyrics




DEMO_PATH1 = 'sample-6s.mp3'
DEMO_PATH2 = 'sample-3s.mp3'

def extract_lyrics(file_path):
    track = eyed3.load(file_path)
    if track.tag.lyrics:
        # Accessing the first lyrics entry's text
        lyrics = track.tag.lyrics[0].text
        return lyrics
    else:
        return "Lyrics not found."


def load_audio_features(file_path, lyrics):
    """Load audio file and extract features."""
    y, sr = librosa.load(file_path, sr=None)
    
    # Extract features
    mfccs = librosa.feature.mfcc(y=y, sr=sr)
    chroma = librosa.feature.chroma_stft(y=y, sr=sr)
    tempogram = librosa.feature.tempogram(y=y, sr=sr)
    
    # Compute mean features for simple comparison

    mean_mfccs = np.mean(mfccs, axis=1)
   
    mean_chroma = np.mean(chroma, axis=1)
    mean_tempogram = np.mean(tempogram, axis=1)

    return mean_mfccs, mean_chroma, mean_tempogram, np.array([np.mean(embed_lyrics(lyrics))])

def compare_features(feat1, feat2):
    """Compare two sets of features using cosine similarity."""
    return 1 - cosine(feat1, feat2)

def final_similarity(feat1, feat2):
    # do element wise dot product sum instead of doing a single one for the mean
    for i in range(4):
        try:

            compare_features(feat1[i], feat2[i])
        except:
            print(i)
            print(feat1[i], feat2[i])

    average_similarity = sum(compare_features(feat1[i], feat2[i]) for i in range(4)) / 4
    
    return average_similarity - (1 - average_similarity) * 3.5


