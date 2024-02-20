# Sonoverse
Protecting small artists' work through a decentralized on-chain ML-driven platform, integrating automatic DMCA claims.

## TL; DR
- Music piracy costs the U.S. economy [$12.5 billion annually](https://www.riaa.com/wp-content/uploads/2015/09/20120515_SoundRecordingPiracy.pdf).
- Independent artists are the [fastest growing segment in the music industry](https://www.forbes.com/sites/melissamdaniels/2019/07/10/for-independent-musicians-goingyour-own-way-is-finally-starting-to-pay-off/), yet lack the funds and reach to enforce the Digital Millennium Copyright Act (DMCA).
- We let artists **OWN** their work (stored on InterPlanetary File System) by tracking it on our own Sonoverse Ethereum L2 chain (powered by Caldera).
- Artists receive **Authenticity Certificates** of their work in the form of Non-Fungible Tokens (NFTs), powered by Crossmint’s Minting API.
- We protect against parodies and remixes with our **custom dual-head LSTM neural network model** trained from scratch which helps us differentiate these fraudulent works from originals.
- We proactively query YouTube through their API to constantly find infringing work.
- We’ve integrated with **DMCA Services**, LLC. to automate DMCA claim submissions.

Interested? Keep reading!

## Inspiration
Music piracy, including illegal downloads and streaming, costs the U.S. economy $12.5 billion annually. 
Independent artists are the fastest growing segment in the music industry, yet lack the funds to enforce DMCA.

We asked “Why hasn’t this been solved?” and took our hand at it. Enter Sonoverse, a platform to ensure small musicians can own their own work by automating DMCA detection using deep learning and on-chain technologies.

## The Issue
- Is it even possible to automate DMCA reports?
- How can a complex piece of data like an audio file be meaningfully compared? 
- How do we really know someone OWNS an audio file?
- and more...

These are questions we had too, but by making custom DL models and chain algorithms, we have taken our hand at answering them.

## What we’ve made
We let artists upload their original music to our platform where we store it on decentralized storage (IPFS) and our blockchain to **track ownership**. We also issue Authenticity Certificates to the original artists in the form of Non-Fungible Tokens.

We compare uploaded music with all music on our blockchain to **detect** if it is a parody, remix, or other fraudulent copy of another original song, using audio processing and an LSTM deep learning model built and trained from scratch. 

We proactively query YouTube through their API for “similar” music (based on our **lyric hashes**, **frequency analysis**, and more) to constantly find infringing work. For detected infringing work, we’ve integrated with DMCA Services, LLC. to **automate DMCA claim submissions**.

## How we built it
All together, we used…
- NextJS
- Postgres
- AWS SES
- AWS S3
- IPFS
- Caldera
- Crossmint
- AssemblyAI
- Cohere
- YouTube API
- DMCA Services

It’s a **lot**, but we were able to split up the work between our team. Gashon built most of the backend routes, an email magic link Auth platform, DB support, and AWS integrations. 

At the same time, Varun spent his hours collecting hours of audio clips, training and improving the deep LSTM model, and writing several sound differentiation/identification algorithms. Here’s Varun’s **explanation** of his algorithms: “To detect if a song is a remix, we first used a pre-trained speech to text model to extract lyrics from mp3 files and then analyzed the mel-frequency cepstral coefficients, tempo, melody, and semantics of the lyrics to determine if any songs are very similar. Checking whether a song is a parody is much more nuanced, and we trained a dual-head LSTM neural network model in PyTorch to take in vectorized embeddings of lyrics and output the probability of one of the songs being a parody of the other.”

While Varun was doing that, Ameya built out the blockchain services with Caldera and Crossmint, and integrated DMCA Services. Ameya ran a Ethereum L2 chain specific for this project (check it out [here](https://treehacks-2024.explorer.caldera.xyz)) using Caldera. He built out significant infrastructure to upload audio files to IPFS (decentralized storage) and interact with the Caldera chain. He also created the Authenticity Certificate using Crossmint that’s delivered directly to each Sonoverse user’s account.

Ameya and Gashon came together at the end to create the Sonoverse frontend, while Varun pivoted to create our YouTube API jobs that query through recently uploaded videos to find infringing content.

## Challenges we overcame
We couldn’t find existing models to detect parodies and had to train a custom model from scratch on training data we had to find ourselves. Of course, this was quite challenging, but with audio files each being unique, we had to create a dataset of hours of audio clips.

And, like always, integration was difficult. The power of a team was a huge plus, but also a challenge. Ameya’s blockchain infrastructure had Solidity compilation challenges when porting into Gashon’s platform (which took some precious hours to sort out). Varun’s ML algorithms ran on a Python backend which had to be hosted alongside our NextJS platform. You can imagine what else we had to change and fix and update, so I won’t bore you.

Another major challenge was something we brought on ourselves, honestly. We set our aim high so we had to use several different frameworks, services, and technologies to add all the features we wanted. This included several hours of us learning new technologies and services, and figuring out how to implement them in our project.

## Accomplishments that we're proud of
Blockchain has a lot of cool and real-world applications, but we’re excited to have settled on Sonoverse. We identified a simple (yet technically complex) way to solve a problem that affects many small artists.
We also made a sleek web platform, in just a short amount of time, with scalable endpoints and backend services.

We also designed and trained a deep learning LSTM model to identify original audios vs fraudulent ones (remixes, speed ups, parodies, etc) that achieved **93% accuracy**.

## What we learned

### About DMCA
We learned how existing DMCA processes are implemented and the large capital costs associated with them. We became **experts** on digital copyrights and media work!

### Blockchain 
We learned how to combine centralized and decentralized infrastructure solutions to create a cohesive **end-to-end** project.

## What's next for Sonoverse
We're looking forward to incorporating on-chain **royalties** for small artists by detecting when users consume their music and removing the need for formal contracts with big companies to earn revenue.
We’re excited to also add support for more public APIs in addition to YouTube API!
