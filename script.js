const icons = document.querySelectorAll(".icon");

icons.forEach(icon => {
  let offsetX, offsetY;

  icon.addEventListener("mousedown", (e) => {
    e.preventDefault(); // prevents weird text/image selection

    // Calculate offset between mouse and top-left corner of the icon
    offsetX = e.clientX - icon.offsetLeft;
    offsetY = e.clientY - icon.offsetTop;

    // While the mouse moves, move the icon
    function onMouseMove(e) {
      icon.style.left = (e.clientX - offsetX) + "px";
      icon.style.top = (e.clientY - offsetY) + "px";
    }

    // When mouse is released, stop listening
    function onMouseUp() {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      icon.style.cursor = "grab";
    }

    // Attach listeners
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    // Change cursor while dragging
    icon.style.cursor = "grabbing";
  });
});

  
function updateTime() {
    const timeDate = document.getElementById("time-date");
    const now = new Date();
    
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
  
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    const dateStr = now.toLocaleDateString(undefined, options);
  
    timeDate.textContent = `${hours}:${minutes} • ${dateStr}`;
  }
  
  // Initial call
  updateTime();
  // Update every 30 seconds
  setInterval(updateTime, 30000);

// Scatter icons randomly on page load
window.addEventListener("load", () => {
    const icons = document.querySelectorAll(".icon");
    const desktop = document.querySelector(".desktop");
  
    const desktopWidth = desktop.clientWidth;
    const desktopHeight = desktop.clientHeight;
  
    icons.forEach(icon => {
      const iconWidth = icon.offsetWidth;
      const iconHeight = icon.offsetHeight;
  
      // Generate random positions, keeping them fully visible
      const randomX = Math.floor(Math.random() * (desktopWidth - iconWidth));
      const randomY = Math.floor(Math.random() * (desktopHeight - iconHeight - 100)); // 100px margin for dock
  
      icon.style.left = randomX + "px";
      icon.style.top = randomY + "px";
    });
  });


  document.addEventListener("DOMContentLoaded", () => {
    const projects = [
      { iconId: "project1", popupId: "project1-popup" },
      { iconId: "project2", popupId: "project2-popup" }
    ];
  
    projects.forEach(proj => {
      const icon = document.getElementById(proj.iconId);
      const popup = document.getElementById(proj.popupId);
      const titleBar = popup.querySelector(".project-titlebar");
      const closeBtn = popup.querySelector(".close-btn");
      const minimizeBtn = popup.querySelector(".minimize-btn");
      const maximizeBtn = popup.querySelector(".maximize-btn");
  
      const dockHeight = 100; 
      const margin = 10;
  
      let offsetX = 0;
      let offsetY = 0;
  
      // --- Popup functions ---
      const openPopup = () => {
        const iconRect = icon.getBoundingClientRect();
  
        popup.style.top = iconRect.top + "px";
        popup.style.left = iconRect.left + "px";
        popup.style.opacity = "0";
        popup.style.transform = "scale(0.3)";
        popup.style.display = "block";
  
        void popup.offsetWidth;
  
        const finalTop = (window.innerHeight - popup.offsetHeight) / 2;
        const finalLeft = (window.innerWidth - popup.offsetWidth) / 2;
  
        popup.style.transition = "all 0.3s ease";
        popup.style.top = finalTop + "px";
        popup.style.left = finalLeft + "px";
        popup.style.transform = "scale(1)";
        popup.style.opacity = "1";
      };
  
      const minimizePopup = () => {
        const iconRect = icon.getBoundingClientRect();
        popup.style.transition = "all 0.3s ease";
        popup.style.top = iconRect.top + "px";
        popup.style.left = iconRect.left + "px";
        popup.style.transform = "scale(0.3)";
        popup.style.opacity = "0";
  
        setTimeout(() => {
          popup.style.display = "none";
        }, 300);
      };
  
      // --- Window buttons ---
      [closeBtn, minimizeBtn, maximizeBtn].forEach(btn => {
        btn.addEventListener("click", e => {
          e.stopPropagation(); // prevent accidental drag/click
          minimizePopup();
        });
      });
  
      // --- Drag & Click Handling ---
      icon.addEventListener("mousedown", e => {
        const startX = e.clientX;
        const startY = e.clientY;
        let hasDragged = false;
  
        const rect = icon.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
  
        function onMouseMove(e) {
          const dx = e.clientX - startX;
          const dy = e.clientY - startY;
  
          if (!hasDragged && Math.sqrt(dx*dx + dy*dy) > 5) hasDragged = true;
  
          if (hasDragged) {
            icon.style.left = (e.clientX - offsetX) + "px";
            icon.style.top = (e.clientY - offsetY) + "px";
          }
        }
  
        function onMouseUp(e) {
          document.removeEventListener("mousemove", onMouseMove);
          document.removeEventListener("mouseup", onMouseUp);
  
          // Open popup only if user clicked, not dragged
          if (!hasDragged) {
            if (popup.style.display === "block") minimizePopup();
            else openPopup();
          }
        }
  
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
      });
  
      // --- Popup Dragging ---
      let isDragging = false;
      let dragOffsetX = 0;
      let dragOffsetY = 0;
  
      titleBar.addEventListener("mousedown", e => {
        if (e.target.closest(".window-buttons")) return;
        isDragging = true;
        const rect = popup.getBoundingClientRect();
        dragOffsetX = e.clientX - rect.left;
        dragOffsetY = e.clientY - rect.top;
        popup.style.transition = "none";
      });
  
      document.addEventListener("mousemove", e => {
        if (!isDragging) return;
  
        let x = e.clientX - dragOffsetX;
        let y = e.clientY - dragOffsetY;
  
        if (x < 0) x = 0;
        if (y < 0) y = 0;
        if (x + popup.offsetWidth > window.innerWidth) x = window.innerWidth - popup.offsetWidth;
        if (y + popup.offsetHeight > window.innerHeight - dockHeight) y = window.innerHeight - popup.offsetHeight - dockHeight;
  
        popup.style.left = x + "px";
        popup.style.top = y + "px";
      });
  
      document.addEventListener("mouseup", () => {
        if (!isDragging) return;
        isDragging = false;
        popup.style.transition = "all 0.3s ease";
      });
    });
  });
  
  

  
  document.addEventListener("DOMContentLoaded", () => {
    const notesIcon = document.getElementById("notes-icon");
    const notesPopup = document.getElementById("notes-popup");
    const titleBar = notesPopup.querySelector(".notes-titlebar");
    const dockHeight = 100;
    const margin = 10;
  
    const closeBtn = notesPopup.querySelector(".close-btn");
    const minimizeBtn = notesPopup.querySelector(".minimize-btn");
    const maximizeBtn = notesPopup.querySelector(".maximize-btn");
  
    const sections = notesPopup.querySelectorAll(".note-section");
    const contents = notesPopup.querySelectorAll(".content-section");
  
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;
  
    // --- Open popup from icon ---
    const openPopup = () => {
      const iconRect = notesIcon.getBoundingClientRect();
      notesPopup.style.top = iconRect.top + "px";
      notesPopup.style.left = iconRect.left + "px";
      notesPopup.style.opacity = "0";
      notesPopup.style.transform = "scale(0.3)";
      notesPopup.style.display = "block";
  
      void notesPopup.offsetWidth; // force reflow
  
      const finalTop = (window.innerHeight - notesPopup.offsetHeight - dockHeight) / 2;
      const finalLeft = (window.innerWidth - notesPopup.offsetWidth) / 2;
  
      notesPopup.style.transition = "all 0.3s ease";
      notesPopup.style.top = finalTop + "px";
      notesPopup.style.left = finalLeft + "px";
      notesPopup.style.transform = "scale(1)";
      notesPopup.style.opacity = "1";
    };
  
    // --- Minimize popup ---
    const minimizePopup = () => {
      const iconRect = notesIcon.getBoundingClientRect();
      notesPopup.style.transition = "all 0.3s ease";
      notesPopup.style.top = iconRect.top + "px";
      notesPopup.style.left = iconRect.left + "px";
      notesPopup.style.transform = "scale(0.3)";
      notesPopup.style.opacity = "0";
  
      setTimeout(() => {
        notesPopup.style.display = "none";
      }, 300);
    };
  
    // Toggle popup when clicking notes icon
    notesIcon.addEventListener("click", () => {
      if (notesPopup.style.display === "block") minimizePopup();
      else openPopup();
    });
  
    // Button functionality (all minimize for now)
    [closeBtn, minimizeBtn, maximizeBtn].forEach(btn => {
      btn.addEventListener("click", e => {
        e.stopPropagation(); // prevent triggering drag or icon toggle
        minimizePopup();
      });
    });
  
    // Dragging functionality
    titleBar.addEventListener("mousedown", e => {
      if (e.target.closest(".window-buttons")) return; // ignore clicks on buttons
      isDragging = true;
      const rect = notesPopup.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      notesPopup.style.transition = "none";
    });
  
    document.addEventListener("mousemove", e => {
      if (!isDragging) return;
      let x = e.clientX - offsetX;
      let y = e.clientY - offsetY;
  
      if (x < 0) x = 0;
      if (y < 0) y = 0;
      if (x + notesPopup.offsetWidth > window.innerWidth) x = window.innerWidth - notesPopup.offsetWidth;
      if (y + notesPopup.offsetHeight > window.innerHeight - dockHeight) y = window.innerHeight - notesPopup.offsetHeight - dockHeight;
  
      notesPopup.style.left = x + "px";
      notesPopup.style.top = y + "px";
    });
  
    document.addEventListener("mouseup", () => {
      if (!isDragging) return;
      isDragging = false;
      notesPopup.style.transition = "all 0.3s ease";
    });
  
    // Section switching (About Me / CV)
    sections.forEach(section => {
      section.addEventListener("click", () => {
        sections.forEach(s => s.classList.remove("active"));
        section.classList.add("active");
  
        contents.forEach(c => c.style.display = "none");
        const target = section.getAttribute("data-section");
        const content = notesPopup.querySelector(`#${target}`);
        if (content) content.style.display = "block";
      });
    });
  });

function openLightbox(thumbnailImg) {
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightbox-img");

  // set src to the clicked thumbnail's src (or a larger variant if you have one)
  lbImg.src = thumbnailImg.src.replace('.md.png', '.png'); // optional swap

  // show the lightbox
  lightbox.classList.add('open');
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightbox-img");

  // hide the lightbox
  lightbox.classList.remove('open');

  // optionally clear src to free memory after animation
  setTimeout(() => {
    lbImg.src = '';
  }, 300);
}