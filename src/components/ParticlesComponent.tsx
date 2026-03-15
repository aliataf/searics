import { memo, useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

const isMobile = () => window.innerWidth <= 768;

const ParticlesComponent = memo(() => {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const options: ISourceOptions = useMemo(
        () => ({
            particles: {
                number: {
                    value: isMobile() ? 60 : 200,
                    density: {
                        enable: true,
                        area: isMobile() ? 400 : 600,
                    },
                },
                color: {
                    value: "#ffffff",
                },
                shape: {
                    type: "circle",
                },
                opacity: {
                    value: { min: 0.2, max: 0.6 },
                },
                size: {
                    value: { min: 0.5, max: 2.5 },
                },
                links: {
                    enable: true,
                    distance: isMobile() ? 80 : 100,
                    color: "#fff",
                    opacity: 0.3,
                    width: 1,
                },
                move: {
                    enable: true,
                    speed: isMobile() ? 2 : 4,
                    direction: "none",
                    outModes: {
                        default: "out",
                    },
                },
            },
            interactivity: {
                detectsOn: "window",
                events: {
                    onHover: {
                        enable: !isMobile(),
                        mode: "grab",
                    },
                    onClick: {
                        enable: !isMobile(),
                        mode: "push",
                    },
                    resize: { enable: true },
                },
                modes: {
                    grab: {
                        distance: 150,
                        links: { opacity: 0.7 },
                    },
                    push: {
                        quantity: 4,
                    },
                },
            },
        }),
        []
    );

    if (!init) return null;

    return <Particles id="tsparticles" options={options} />;
});

ParticlesComponent.displayName = 'ParticlesComponent';

export default ParticlesComponent;
