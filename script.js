const stage = document.getElementById('stage');
        const text = "HAPPY BIRTHDAY";
        const colors = ['#005293', '#fecb00', '#ffffff', '#ff69b4', '#00ff7f'];
        const letters = [];
        const balloons = [];
        const birds = [];

        // Setup Letters
        function initLetters() {
            const chars = text.split('');
            const spacing = window.innerWidth / (chars.length + 1);

            chars.forEach((char, i) => {
                if (char === " ") return;
                const container = document.createElement('div');
                container.className = 'char-box';
                
                const l = document.createElement('div');
                l.className = 'letter';
                l.innerText = char;
                l.style.color = colors[i % colors.length];
                container.appendChild(l);

                const ring = [];
                for(let j=0; j<6; j++) {
                    const item = document.createElement('div');
                    item.className = j % 2 === 0 ? 'star' : 'flower';
                    item.innerText = j % 2 === 0 ? '★' : '🌸';
                    container.appendChild(item);
                    ring.push({ el: item, angle: (j/6) * Math.PI * 2 });
                }

                stage.appendChild(container);
                letters.push({
                    el: container,
                    ring: ring,
                    x: spacing * (i + 1),
                    y: -100 - (i * 100),
                    vy: 2 + Math.random() * 2,
                    rot: 0
                });
            });
        }

        // Spawn Functions
        function spawnBalloon() {
            const b = document.createElement('div');
            b.className = 'balloon';
            b.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
            stage.appendChild(b);
            balloons.push({
                el: b,
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 100,
                vy: - (1 + Math.random() * 2),
                drift: Math.random() * 2
            });
        }

        function spawnBird() {
            const bird = document.createElement('div');
            bird.className = 'bird';
            bird.innerHTML = `<svg viewBox="0 0 100 50"><path d="M0,25 Q25,0 50,25 Q75,0 100,25" fill="none" stroke="black" stroke-width="5">
                <animate attributeName="d" values="M0,25 Q25,0 50,25 Q75,0 100,25; M0,25 Q25,50 50,25 Q75,50 100,25; M0,25 Q25,0 50,25 Q75,0 100,25" dur="0.5s" repeatCount="indefinite" />
            </path></svg>`;
            stage.appendChild(bird);
            const dir = Math.random() > 0.5 ? 1 : -1;
            birds.push({
                el: bird,
                x: dir === 1 ? -50 : window.innerWidth + 50,
                y: Math.random() * 300 + 50,
                vx: dir * (2 + Math.random() * 2)
            });
        }

        function createEcho(x, y) {
            const echo = document.createElement('div');
            echo.className = 'echo';
            echo.style.left = x + 'px';
            echo.style.top = y + 'px';
            echo.style.width = '50px';
            echo.style.height = '50px';
            stage.appendChild(echo);
            setTimeout(() => echo.remove(), 1000);
        }

        // Animation Loop
        function update() {
            const h = window.innerHeight;
            const w = window.innerWidth;

            letters.forEach(l => {
                l.y += l.vy;
                if (l.y > h + 100) {
                    l.y = -150;
                    createEcho(l.x, h - 50);
                }
                l.el.style.transform = `translate(${l.x}px, ${l.y}px)`;
                
                l.rot += 0.05;
                l.ring.forEach(item => {
                    item.angle += 0.05;
                    const ox = Math.cos(item.angle) * 70;
                    const oy = Math.sin(item.angle) * 70;
                    item.el.style.transform = `translate(${ox}px, ${oy}px)`;
                });
            });

            balloons.forEach((b, i) => {
                b.y += b.vy;
                b.x += Math.sin(b.y / 50) * b.drift;
                b.el.style.transform = `translate(${b.x}px, ${b.y}px)`;
                if (b.y < -100) {
                    b.el.remove();
                    balloons.splice(i, 1);
                }
            });

            birds.forEach((bird, i) => {
                bird.x += bird.vx;
                bird.el.style.transform = `translate(${bird.x}px, ${bird.y}px)`;
                if (bird.x < -100 || bird.x > w + 100) {
                    bird.el.remove();
                    birds.splice(i, 1);
                }
            });

            requestAnimationFrame(update);
        }

        initLetters();
        update();
        setInterval(spawnBalloon, 800);
        setInterval(spawnBird, 3000);