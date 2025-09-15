const apps = [
  { name: "Microsoft", img: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
  { name: "AWS", img: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" },
  { name: "teams", img: "MS Teams.png" },
  { name: "ServiceNow", img: "Adobe Experience Manager.png" },
  { name: "SAP", img: "https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg" },
  { name: "Workday", img: "azure.png" },
  { name: "Dropbox", img: "wordpress-logo.png" },
  { name: "Google Cloud", img: "Google Cloud Platform.png" },
  { name: "Oracle", img: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg" },
  { name: "Box", img: "HubSpot.png" },
  { name: "Atlassian", img: "Okta_idmCKbU44P_1.png" },
  { name: "Slack", img: "https://upload.wikimedia.org/wikipedia/commons/7/76/Slack_Icon.png" }
];

const container = document.getElementById('circle-container');
const radius = 220;
const totalIcons = apps.length;
const angleStep = (2 * Math.PI) / totalIcons;
const integrationInterval = 4000; // Time between integrations, increased to allow for animation time

// Create and position icons and lines
const icons = apps.map((app, i) => {
  const div = document.createElement('div');
  div.className = "app-icon";
  div.innerHTML = `<img src="${app.img}" alt="${app.name}">`;
  div.title = app.name;
  container.appendChild(div);

  const line = document.createElement('div');
  line.className = "connection-line";
  container.appendChild(line);

  return { el: div, line, baseAngle: i * angleStep, integrating: false };
});

// Create integration effect element
const integrationEffect = document.createElement('div');
integrationEffect.className = "integration-effect";
container.appendChild(integrationEffect);

// Initialize fixed positions
function initPositions() {
  const centerX = container.offsetWidth / 2;
  const centerY = container.offsetHeight / 2;

  icons.forEach((icon) => {
    const angle = icon.baseAngle;
    const x = centerX + radius * Math.cos(angle) - 35;
    const y = centerY + radius * Math.sin(angle) - 35;

    icon.el.style.left = `${x}px`;
    icon.el.style.top = `${y}px`;

    const dx = x + 35 - centerX;
    const dy = y + 35 - centerY;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angleDeg = Math.atan2(dy, dx) * (180 / Math.PI);

    icon.line.style.width = `${length}px`;
    icon.line.style.left = `${centerX}px`;
    icon.line.style.top = `${centerY}px`;
    icon.line.style.transform = `rotate(${angleDeg}deg)`;
    icon.line.style.opacity = "0.4";
  });
}

// Randomly integrate 2 or 3 icons into center
function integrateIcons() {
  const num = Math.floor(Math.random() * 1) + 2; // 2 or 3
  const availableIcons = icons.filter(i => !i.integrating);
  if (availableIcons.length < num) return;

  const selected = [];
  for (let i = 0; i < num; i++) {
    const idx = Math.floor(Math.random() * availableIcons.length);
    selected.push(availableIcons.splice(idx, 1)[0]);
  }

  selected.forEach(icon => {
    icon.integrating = true;
    icon.line.classList.add('electric');
  });

  const centerX = container.offsetWidth / 2 - 35;
  const centerY = container.offsetHeight / 2 - 35;

  // After electric effect time, start integration
  setTimeout(() => {
    selected.forEach(icon => {
      // Create clone for integration animation
      const clone = icon.el.cloneNode(true);
      clone.style.transition = "all 1.5s ease-in-out";
      clone.style.position = "absolute";
      clone.style.left = icon.el.style.left;
      clone.style.top = icon.el.style.top;
      clone.style.zIndex = "12";
      clone.style.animation = "none"; // Disable pulse for clone
      container.appendChild(clone);

      // Animate clone to center
      setTimeout(() => {
        clone.style.left = `${centerX}px`;
        clone.style.top = `${centerY}px`;
        clone.style.transform = "scale(0.8)";
        clone.style.opacity = "0";
      }, 10);

      // Hide original icon
      icon.el.style.display = 'none';
    });

    // Show integration effect
    integrationEffect.style.animation = 'none';
    setTimeout(() => {
      integrationEffect.style.animation = 'integrate 1.5s forwards';
    }, 10);

    // Clean up after animation
    setTimeout(() => {
      // Remove clones
      const clones = container.querySelectorAll('.app-icon:not([title])'); // Clones don't have title
      clones.forEach(clone => container.removeChild(clone));

      selected.forEach(icon => {
        icon.line.classList.remove('electric');
        icon.el.style.display = 'flex';
        icon.integrating = false;
      });
    }, 1500);
  }, 1000); // 1s for electric effect
}

// Initialize
initPositions();
setTimeout(integrateIcons, 1000); // Initial integration after a short delay
setInterval(integrateIcons, integrationInterval);