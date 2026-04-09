import RAP_CONFIG from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    const sceneEl = document.querySelector('a-scene');
    const arContainer = document.querySelector('#ar-container');
    const scanningScreen = document.querySelector('#scanning-screen');
    const lyricsPanel = document.querySelector('#lyrics-panel');
    const lyricsText = document.querySelector('#lyrics-text');
    const lyricsTitle = document.querySelector('#lyrics-title');
    const videoOverlay = document.querySelector('#video-overlay');
    const closeLyricsBtn = document.querySelector('#close-lyrics');
    const closeVideoBtn = document.querySelector('#close-video');
    const youtubePlayerContainer = document.querySelector('#youtube-player');

    let currentTargetIndex = -1;

    // --- 1. Génération dynamique des cibles ---
    Object.keys(RAP_CONFIG).forEach(index => {
        const config = RAP_CONFIG[index];
        const targetEntity = document.createElement('a-entity');
        targetEntity.setAttribute('mindar-image-target', `targetIndex: ${index}`);
        targetEntity.id = `target-${index}`;

        // Groupe pour le décalage (offset) si page blanche
        const contentGroup = document.createElement('a-entity');
        contentGroup.setAttribute('position', `${config.contentOffset.x} ${config.contentOffset.y} ${config.contentOffset.z}`);

        // Bouton Play AR (Cercle blanc avec icône)
        const playBtn = document.createElement('a-entity');
        playBtn.setAttribute('geometry', 'primitive: circle; radius: 0.2');
        playBtn.setAttribute('material', 'color: white; opacity: 0.9; transparent: true');
        playBtn.setAttribute('class', 'clickable');
        playBtn.setAttribute('position', '0 0 0.1'); // Légèrement au-dessus de la page
        
        // Icône Play (Triangle noir)
        const playIcon = document.createElement('a-entity');
        playIcon.setAttribute('geometry', 'primitive: triangle; vertexA: 0 0.08 0; vertexB: 0 -0.08 0; vertexC: 0.12 0 0');
        playIcon.setAttribute('material', 'color: #2196f3');
        playIcon.setAttribute('position', '-0.03 0 0.01');
        playBtn.appendChild(playIcon);

        // Titre - Ajout d'un fond pour la lisibilité
        const titleBg = document.createElement('a-entity');
        titleBg.setAttribute('geometry', 'primitive: plane; width: 0.8; height: 0.2');
        titleBg.setAttribute('material', 'color: white; opacity: 0.8');
        titleBg.setAttribute('position', '0 0.4 0');
        
        const titleText = document.createElement('a-entity');
        titleText.setAttribute('text', `value: ${config.title}; color: #1a1a1a; align: center; width: 2.5`);
        titleText.setAttribute('position', '0 0.4 0.01');
        contentGroup.appendChild(titleBg);
        contentGroup.appendChild(titleText);

        // Bouton Lyrics AR - Amélioré
        const lyricsBtn = document.createElement('a-entity');
        lyricsBtn.setAttribute('geometry', 'primitive: plane; width: 0.5; height: 0.15');
        lyricsBtn.setAttribute('material', 'color: #2196f3; opacity: 0.9');
        lyricsBtn.setAttribute('text', 'value: VOIR LES PAROLES; color: white; align: center; width: 1.2');
        lyricsBtn.setAttribute('position', '0 -0.4 0');
        lyricsBtn.setAttribute('class', 'clickable');
        contentGroup.appendChild(lyricsBtn);

        // GIF ou Image additionnelle
        if (config.gif) {
            const gifPlane = document.createElement('a-entity');
            gifPlane.setAttribute('geometry', 'primitive: plane; width: 0.4; height: 0.4');
            gifPlane.setAttribute('material', `src: ${config.gif}; transparent: true; shader: flat`);
            gifPlane.setAttribute('position', '0.66 0 0');
            contentGroup.appendChild(gifPlane);
        }

        contentGroup.appendChild(playBtn);
        targetEntity.appendChild(contentGroup);
        arContainer.appendChild(targetEntity);

        // Evenements AR
        targetEntity.addEventListener('targetFound', () => {
            console.log(`🎯 Cible détectée : ${index} (${config.title})`);
            scanningScreen.style.opacity = '0';
            setTimeout(() => scanningScreen.classList.add('hidden'), 500);
            currentTargetIndex = index;
        });

        targetEntity.addEventListener('targetLost', () => {
            console.log(`❌ Cible perdue : ${index}`);
            // On peut choisir d'afficher à nouveau le scan après un délai
            setTimeout(() => {
                if (currentTargetIndex == index) {
                    scanningScreen.classList.remove('hidden');
                    scanningScreen.style.opacity = '1';
                }
            }, 2000);
        });

        // Clicks
        playBtn.addEventListener('click', () => openVideo(config.youtubeId));
        lyricsBtn.addEventListener('click', () => openLyrics(config));
    });

    // --- 2. Fonctions UI ---

    function openLyrics(config) {
        lyricsTitle.innerText = config.title;
        lyricsText.innerText = config.lyrics;
        lyricsPanel.classList.add('active');
    }

    function openVideo(videoId) {
        videoOverlay.style.display = 'flex';
        youtubePlayerContainer.innerHTML = `
            <iframe 
                src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
                title="YouTube video player" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        `;
    }

    closeLyricsBtn.addEventListener('click', () => {
        lyricsPanel.classList.remove('active');
    });

    closeVideoBtn.addEventListener('click', () => {
        videoOverlay.style.display = 'none';
        youtubePlayerContainer.innerHTML = ''; // Arrête la vidéo
    });

    // Tap sur le fond pour fermer les panels
    sceneEl.addEventListener('click', (e) => {
        if (e.target.nodeName === 'A-SCENE') {
            lyricsPanel.classList.remove('active');
        }
    });

});
