import librosa
import numpy as np
from scipy.spatial.distance import euclidean, cosine
import eyed3



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


def load_audio_features(file_path):
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
    
    return mean_mfccs, mean_chroma, mean_tempogram

def compare_features(feat1, feat2):
    """Compare two sets of features using cosine similarity."""
    return 1 - cosine(feat1, feat2)

def final_similarity(feat1, feat2):
    average_similarity = sum(compare_features(feat1[i], feat2[i]) for i in range(3)) / 3
    return average_similarity 

# # Load features for two audio files
features1 = load_audio_features(DEMO_PATH1)
features2 = load_audio_features(DEMO_PATH2)

# Compare each feature set
print(final_similarity(features1, features2))

