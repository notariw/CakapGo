
        function startLearning() {
            // Add a smooth animation before redirect
            const button = event.target;
            button.style.transform = 'scale(0.95)';
            button.innerHTML = 'Loading...';
            
            setTimeout(() => {
                window.location.href = 'register.html';
            }, 500);
        }

        function signIn() {
            window.location.href = 'login.html';
        }

        // Add some interactive hover effects
        document.querySelectorAll('.floating-element').forEach(element => {
            element.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.1)';
                this.style.transition = 'transform 0.3s ease';
            });
            
            element.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });

        // Add parallax effect on scroll
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.floating-elements');
            const speed = scrolled * 0.5;
            parallax.style.transform = `translateY(${speed}px)`;
        });