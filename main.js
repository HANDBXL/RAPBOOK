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

        // Groupe pour le décalage (offset) vers la page annexe
        const contentGroup = document.createElement('a-entity');
        contentGroup.setAttribute('position', `${config.contentOffset.x} ${config.contentOffset.y} ${config.contentOffset.z}`);

        // --- 3D UI REFINEMENT (Smaller, Premium) ---

        // Bouton Play AR (Compact & Elegant)
        const playBtn = document.createElement('a-entity');
        playBtn.setAttribute('geometry', 'primitive: circle; radius: 0.08');
        playBtn.setAttribute('material', 'color: #ffffff; opacity: 0.95; transparent: true; shader: flat');
        playBtn.setAttribute('class', 'clickable');
        playBtn.setAttribute('position', '0 0.1 0.1'); 
        
        const playIcon = document.createElement('a-entity');
        playIcon.setAttribute('geometry', 'primitive: triangle; vertexA: 0 0.03 0; vertexB: 0 -0.03 0; vertexC: 0.05 0 0');
        playIcon.setAttribute('material', 'color: #2196f3; shader: flat');
        playIcon.setAttribute('position', '-0.015 0 0.01');
        playBtn.appendChild(playIcon);

        // Titre sur la page blanche
        const titleText = document.createElement('a-entity');
        titleText.setAttribute('text', `value: ${config.title}\n${config.artist}; color: #1a1a1a; align: center; width: 1.5; font: https://cdn.aframe.io/fonts/Aileron-Semibold.fnt`);
        titleText.setAttribute('position', '0 0.35 0');
        contentGroup.appendChild(titleText);

        // Bouton Paroles AR (Minimalist Pill Style)
        const lyricsBtn = document.createElement('a-entity');
        lyricsBtn.setAttribute('geometry', 'primitive: plane; width: 0.4; height: 0.12');
        lyricsBtn.setAttribute('material', 'color: #1a1a1a; opacity: 0.85; transparent: true; shader: flat');
        lyricsBtn.setAttribute('text', 'value: VOIR LES PAROLES; color: white; align: center; width: 0.8');
        lyricsBtn.setAttribute('position', '0 -0.15 0');
        lyricsBtn.setAttribute('class', 'clickable');
        contentGroup.appendChild(lyricsBtn);

        // Ajout d'une ligne séparatrice élégante
        const line = document.createElement('a-entity');
        line.setAttribute('geometry', 'primitive: plane; width: 0.5; height: 0.005');
        line.setAttribute('material', 'color: #2196f3; opacity: 0.5');
        line.setAttribute('position', '0 0.25 0');
        contentGroup.appendChild(line);

        contentGroup.appendChild(playBtn);
        targetEntity.appendChild(contentGroup);
        arContainer.appendChild(targetEntity);

        // Evenements AR
        targetEntity.addEventListener('targetFound', () => {
            console.log(`🎯 Found: ${config.title}`);
            scanningScreen.style.opacity = '0';
            setTimeout(() => scanningScreen.classList.add('hidden'), 500);
            currentTargetIndex = index;
        });

        targetEntity.addEventListener('targetLost', () => {
            setTimeout(() => {
                if (currentTargetIndex == index) {
                    scanningScreen.classList.remove('hidden');
                    scanningScreen.style.opacity = '1';
                }
            }, 3000);
        });

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
        youtubePlayerContainer.innerHTML = ''; 
    });

    sceneEl.addEventListener('click', (e) => {
        if (e.target.nodeName === 'A-SCENE') {
            lyricsPanel.classList.remove('active');
        }
    });

});
