import requests

def transcribe_audio(audio_file_path):
    headers = {'authorization': "7d7a31e53b36411a95c258e6519c3bae"}
    response = requests.post('https://api.assemblyai.com/v2/upload', headers=headers, files={'file': open(audio_file_path, 'rb')})
    audio_url = response.json()['upload_url']
    
    json = {'audio_url': audio_url}
    response = requests.post('https://api.assemblyai.com/v2/transcript', json=json, headers=headers)
    transcript_id = response.json()['id']
    
    while True:
        response = requests.get(f'https://api.assemblyai.com/v2/transcript/{transcript_id}', headers=headers)
        if response.json()['status'] == 'completed':
            return response.json()['text']
        elif response.json()['status'] == 'failed':
            return "Transcription failed"


