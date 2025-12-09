document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Add click animation
                this.classList.add('clicked');
                setTimeout(() => {
                    this.classList.remove('clicked');
                }, 300);
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Button click animations
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            // Get click position
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Position ripple
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Scroll animations
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.animate-on-scroll, .timeline-item, .project-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                const delay = element.getAttribute('data-delay') || '0';
                setTimeout(() => {
                    element.classList.add('visible');
                }, parseFloat(delay) * 1000);
            }
        });
    };
    
    // Run on load and scroll
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
    
    // Navbar background change on scroll
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('nav');
        if (window.scrollY > 50) {
            nav.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            nav.style.padding = '0.8rem 0';
        } else {
            nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            nav.style.padding = '1rem 0';
        }
    });
});
// Theme Changer
document.addEventListener('DOMContentLoaded', function() {
  const themeOptions = document.querySelectorAll('.theme-option');
  const html = document.documentElement;
  
  // Set initial theme
  const savedTheme = localStorage.getItem('theme') || 'blue';
  html.setAttribute('data-theme', savedTheme);
  
  // Activate current theme button
  document.querySelector(`.theme-option[data-theme="${savedTheme}"]`).classList.add('active');
  
  // Theme switcher functionality
  themeOptions.forEach(option => {
    option.addEventListener('click', function() {
      const theme = this.getAttribute('data-theme');
      
      // Update theme
      html.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      
      // Update active button
      themeOptions.forEach(opt => opt.classList.remove('active'));
      this.classList.add('active');
    });
  });
});


// Visitor Function
async function trackVisitor() {
  try {
  
    const ipResponse = await fetch('https://ipapi.co/json/');
    const ipData = await ipResponse.json();


    const visitorData = {
      pageUrl: window.location.href,
      referrer: document.referrer || "direct",
      deviceType: getDeviceType(),
      browser: getBrowser(),
      os: getOS(),
      ip: ipData.ip,
      city: ipData.city,
      country: ipData.country_name,
      timezone: ipData.timezone
    };


    await sendToGoogleSheets(visitorData);
  } catch (error) {
    console.log("Error tracking visitor:", error);
  }
}

function getDeviceType() {
  const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);
  return isMobile ? "Mobile" : "Desktop";
}


function getBrowser() {
  const userAgent = navigator.userAgent;
  if (userAgent.includes("Chrome")) return "Chrome";
  if (userAgent.includes("Firefox")) return "Firefox";
  if (userAgent.includes("Safari")) return "Safari";
  return "Other";
}

function getOS() {
  const userAgent = navigator.userAgent;
  if (userAgent.includes("Windows")) return "Windows";
  if (userAgent.includes("Mac")) return "MacOS";
  if (userAgent.includes("Linux")) return "Linux";
  return "Other";
}

async function sendToGoogleSheets(data) {
  const webAppUrl = "https://script.google.com/macros/s/AKfycbxiTWDSj8iFdNRL4SOQDSo0Qdy5cGnOCsjx1vsDOgQiFQj0crgZFpgqjvw2Gar9Xfd5SA/exec"; 
  try {
    await fetch(webAppUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    console.log("Visitor data sent!");
  } catch (error) {
    console.log("Failed to send data:", error);
  }
}

// Run when page loads
trackVisitor();