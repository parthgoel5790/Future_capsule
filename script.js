document.addEventListener("DOMContentLoaded", () => {
    // ---- 1. MOBILE RESPONSIVE HAMBURGER MENU ----
    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");

    menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");
        const icon = menuToggle.querySelector("i");
        icon.classList.toggle("fa-bars");
        icon.classList.toggle("fa-xmark");
    });

    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("active");
            const icon = menuToggle.querySelector("i");
            icon.classList.add("fa-bars");
            icon.classList.remove("fa-xmark");
            document.querySelectorAll(".nav-link").forEach(el => el.classList.remove("active"));
            link.classList.add("active");
        });
    });

    // ---- 2. ALL NAVIGATION LINKS BUTTONS TRIGGERS ----
    document.getElementById("navLogo").addEventListener("click", () => window.scrollTo(0, 0));
    document.getElementById("loginBtn").addEventListener("click", () => alert("🔐 Authorization System Module is integration-ready!"));
    
    document.getElementById("heroCreateBtn").addEventListener("click", () => {
        document.getElementById("createSection").scrollIntoView({ behavior: "smooth" });
    });

    document.getElementById("heroExploreBtn").addEventListener("click", () => {
        document.getElementById("capsulesSection").scrollIntoView({ behavior: "smooth" });
    });

    const aiQuotesList = [
        "“By 2030, you will be living in your dream home, running your own company and inspiring millions.”",
        "“In 5 years, your secret passion project will turn into a global phenomenon. Stay focused!”",
        "“The tech capsule you locked today contains ideas that will define your career pivot by 2028.”"
    ];
    document.getElementById("aiBtn").addEventListener("click", () => {
        const quoteBox = document.getElementById("aiQuote");
        const randomIndex = Math.floor(Math.random() * aiQuotesList.length);
        quoteBox.style.opacity = 0;
        setTimeout(() => {
            quoteBox.innerText = aiQuotesList[randomIndex];
            quoteBox.style.opacity = 1;
        }, 200);
    });

    document.querySelectorAll(".alert-link, .social-link").forEach(element => {
        element.addEventListener("click", (e) => {
            e.preventDefault();
            alert("🔗 This link module is operational and ready to hook with live API endpoints.");
        });
    });

    document.getElementById("newsletterForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("newsletterEmail").value;
        alert(`📩 Thank you! '${email}' has been securely subscribed to updates.`);
        document.getElementById("newsletterEmail").value = "";
    });

    // ---- 3. FILE UPLOAD INTERACTION LAYER ----
    const uploadZone = document.getElementById("uploadZone");
    const fileInput = document.getElementById("fileInput");
    const uploadText = document.getElementById("uploadText");

    uploadZone.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", () => {
        if(fileInput.files.length > 0) {
            uploadText.innerHTML = `📁 Selected: <strong>${fileInput.files[0].name}</strong>`;
        }
    });


    // ---- 4. LOCALSTORAGE, TIMERS, POPUP & DELETE ENGINE ----
    const capsuleForm = document.getElementById("capsuleForm");
    const capsulesGrid = document.getElementById("capsulesGrid");
    const noCapsulesMsg = document.getElementById("noCapsulesMsg");

    const capsuleModal = document.getElementById("capsuleModal");
    const modalClose = document.getElementById("modalClose");
    const modalTitle = document.getElementById("modalTitle");
    const modalMood = document.getElementById("modalMood");
    const modalDate = document.getElementById("modalDate");
    const modalMessage = document.getElementById("modalMessage");

    function formatDate(dateString) {
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    modalClose.addEventListener("click", () => capsuleModal.classList.remove("open"));
    capsuleModal.addEventListener("click", (e) => {
        if(e.target === capsuleModal) capsuleModal.classList.remove("open");
    });

    // Load capsules from LocalStorage
    function loadSavedCapsules() {
        const savedCapsules = JSON.parse(localStorage.getItem("futureCapsules")) || [];
        
        if (savedCapsules.length > 0) {
            noCapsulesMsg.style.display = "none";
            capsulesGrid.innerHTML = ""; 
            
            // Index pass kar rahe hain taaki delete karte waqt pata chale kaun sa delete karna hai
            savedCapsules.forEach((capsule, index) => {
                renderCapsuleCard(capsule.title, capsule.date, capsule.mood, capsule.message, index);
            });
        } else {
            noCapsulesMsg.style.display = "flex";
            capsulesGrid.innerHTML = ""; 
        }
        updateAllCountdowns();
    }

    // Render Card with dynamic Delete Button
    function renderCapsuleCard(title, date, mood, message, index) {
        const wrapper = document.createElement("div");
        wrapper.className = "capsule_card_wrapper";

        wrapper.innerHTML = `
            <div class="timeline_dot"></div>
            <div class="capsule_item_card" data-date="${date}" data-message="${encodeURIComponent(message)}" data-title="${encodeURIComponent(title)}" data-mood="${encodeURIComponent(mood)}">
                <button class="delete-capsule-btn" data-index="${index}" title="Delete Capsule">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
                <h3>${title} ${mood.split(' ')[0]}</h3>
                <p class="target_date_display">${formatDate(date)}</p>
                <div class="lock_status_badge"><i class="fa-solid fa-lock"></i> Locked</div>
                <div class="countdown_timer_box">Calculating...</div>
            </div>
        `;
        
        // Card content click logic (sirf tab chalega agar delete icon par click NA hua ho)
        const cardItem = wrapper.querySelector(".capsule_item_card");
        cardItem.addEventListener("click", (e) => {
            if (e.target.closest(".delete-capsule-btn")) return; 
            handleCardClick(cardItem);
        });

        // Delete Button Click Logic
        const deleteBtn = wrapper.querySelector(".delete-capsule-btn");
        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // Card open hone se rokne ke liye
            if (confirm("🚨 Are you sure you want to permanently delete this future capsule?")) {
                deleteCapsule(index);
            }
        });

        capsulesGrid.prepend(wrapper);
    }

    // Delete core function execution
    function deleteCapsule(index) {
        let savedCapsules = JSON.parse(localStorage.getItem("futureCapsules")) || [];
        
        // Array se us index wale item ko hatao
        savedCapsules.splice(index, 1);
        
        // Updated array wapas local storage me save karo
        localStorage.setItem("futureCapsules", JSON.stringify(savedCapsules));
        
        // Screen refresh karo taaki naye index mapping set ho sakein
        loadSavedCapsules();
    }

    function handleCardClick(card) {
        const isLocked = card.getAttribute("data-status") === "locked";
        
        if (isLocked) {
            alert("🔒 ACCESS DENIED: This capsule is heavily time-locked. Wait for the countdown to hit zero!");
        } else {
            const title = decodeURIComponent(card.getAttribute("data-title"));
            const mood = decodeURIComponent(card.getAttribute("data-mood"));
            const date = card.getAttribute("data-date");
            const message = decodeURIComponent(card.getAttribute("data-message"));

            modalTitle.innerText = title;
            modalMood.innerText = mood;
            modalDate.innerText = `Unlocked on: ${formatDate(date)}`;
            modalMessage.innerText = message;

            capsuleModal.classList.add("open");
        }
    }

    function updateAllCountdowns() {
        const cards = document.querySelectorAll(".capsule_item_card");
        
        cards.forEach(card => {
            const targetDateStr = card.getAttribute("data-date");
            const timerBox = card.querySelector(".countdown_timer_box");
            if (!targetDateStr) return;

            const targetTime = Date.parse(targetDateStr + "T00:00:00Z");
            const nowTime = new Date();
            const nowUTC = Date.UTC(
                nowTime.getUTCFullYear(), nowTime.getUTCMonth(), nowTime.getUTCDate(), 
                nowTime.getUTCHours(), nowTime.getUTCMinutes(), nowTime.getUTCSeconds()
            );

            const difference = targetTime - nowUTC;

            if (difference <= 0) {
                timerBox.innerHTML = "🔓 Ready to Open!";
                card.setAttribute("data-status", "unlocked");
                const badge = card.closest(".capsule_card_wrapper").querySelector(".lock_status_badge");
                if (badge) {
                    badge.innerHTML = '<i class="fa-solid fa-lock-open"></i> Unlocked';
                    badge.style.color = "#10B981";
                }
                return;
            }

            card.setAttribute("data-status", "locked");
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

            timerBox.innerHTML = `<span style="color:#fff">${days}</span> Days <span style="color:#fff">${String(hours).padStart(2, '0')}</span> Hrs <span style="color:#fff">${String(minutes).padStart(2, '0')}</span> Mins`;
        });
    }

    // Form Submit Event Handler
    capsuleForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = document.getElementById("capsule-title").value;
        const date = document.getElementById("unlock-date").value;
        const mood = document.getElementById("select-mood").value;
        const message = document.getElementById("your-message").value;

        const targetTime = Date.parse(date + "T00:00:00Z");
        const nowTime = new Date();
        const nowUTC = Date.UTC(nowTime.getUTCFullYear(), nowTime.getUTCMonth(), nowTime.getUTCDate());

        if (targetTime < nowUTC) {
            alert("⚠️ Time travel error! Please select a future date to lock your capsule.");
            return;
        }

        const savedCapsules = JSON.parse(localStorage.getItem("futureCapsules")) || [];
        
        // Pehle data ko storage array me push karo
        savedCapsules.push({ title, date, mood, message });
        localStorage.setItem("futureCapsules", JSON.stringify(savedCapsules));

        // Form clean up
        capsuleForm.reset();
        uploadText.innerHTML = `<span>Click to upload</span> or drag and drop`;

        // Dobara se state load karo taaki naye element ko correct index array positions mil sakein
        loadSavedCapsules();

        // Smooth scroll view focus 
        capsulesGrid.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    loadSavedCapsules();
    setInterval(updateAllCountdowns, 1000);
});