// document.addEventListener('DOMContentLoaded', function () {
//     gsap.registerPlugin(MotionPathPlugin);
//     const mainTL = gsap.timeline();

//     document.querySelectorAll('[data-line]').forEach((currentLinePath) => {
//         const iconSelector = `[data-icon="${currentLinePath.dataset.line}"]`;
//         const icon = document.querySelector(iconSelector);

//         // Create a looping timeline for this icon
//         const loopTL = gsap.timeline({ repeat: -1, defaults: { transformOrigin: "50% 50%" } });

//         // Step 1: Start with Fade out and scale down
//         loopTL.from(icon, 
//             { opacity: 0, scale: 0, duration: 0.5, ease: "none" }
//         );

//         // Step 2: Motion path
//         loopTL.to(icon, {
//             duration: gsap.utils.random(4, 8),
//             ease: "power2.inOut",
//             motionPath: {
//                 path: currentLinePath,
//                 align: currentLinePath,
//                 alignOrigin: [0.5, 0.5],
//             }
//         }, 0);

//         // Step 3: End with Fade out and scale down
//         loopTL.to(icon, 
//             { opacity: 0, scale: 0, duration: 0.5, ease: "power4.out" },
//             ">-1"
//         );

//         // Add this looped timeline to the mainTL timeline
//         mainTL.add(loopTL, gsap.utils.random(0,5));
//     });
// });


document.addEventListener('DOMContentLoaded', function () {
    gsap.registerPlugin(MotionPathPlugin);

    let mainTL;

    // Responsive handling using callAfterResize
    function callAfterResize(func, delay) {
        let dc = gsap.delayedCall(delay || 0.2, func).pause(),
            handler = () => dc.restart(true);
        window.addEventListener("resize", handler);
        return handler; // in case you want to remove the listener later
    }

    function createAnimation() {
        if (mainTL) {
            mainTL.kill(); // Clean up previous animation
        }

        mainTL = gsap.timeline();

        const validPaths = Array.from(document.querySelectorAll('[data-line]')).filter(path => {
            const parentSVG = path.closest('svg');
            return parentSVG && getComputedStyle(parentSVG).display !== 'none';
        });

        validPaths.map((currentLinePath) => {
            console.log(currentLinePath);
            
            const iconSelector = `[data-icon="${currentLinePath.dataset.line}"]`;
            const icon = document.querySelector(iconSelector);

            // Optional: reset styles on resize to avoid leftovers
            gsap.set(icon, { clearProps: "all" });

            const loopTL = gsap.timeline({
                repeat: -1,
                defaults: { transformOrigin: "50% 50%" }
            });

            // Step 1: Fade in
            loopTL.from(icon, {
                opacity: 0,
                scale: 0,
                duration: 0.5,
            });

            // Step 2: Motion path
            loopTL.to(icon, {
                duration: gsap.utils.random(4, 8),
                ease: "power2.inOut",
                motionPath: {
                    path: currentLinePath,
                    align: currentLinePath,
                    alignOrigin: [0.5, 0.5]
                }
            }, 0); // start at time 0 (sync with previous step)

            // Step 3: Fade out
            loopTL.to(icon, {
                opacity: 0,
                scale: 0,
                duration: 0.5,
                ease: "power4.out"
            }, ">-1"); // start 1 seconds before the end of the previous step

            mainTL.add(loopTL, gsap.utils.random(0, 5));
        });
    }

    // Initial animation
    createAnimation();

    // Use callAfterResize to debounce the resize event
    callAfterResize(() => {
        createAnimation(); // Re-init animation on resize
    }, 0.3); // debounce delay in seconds
});


