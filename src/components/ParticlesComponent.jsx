import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const ParticlesComponent = () => {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const options = useMemo(
        () => ({
            particles: {
                number: {
                    value: 100,
                    density: {
                        enable: true,
                        area: 800,
                    },
                },
                color: {
                    value: "#ffffff",
                },
                shape: {
                    type: "circle",
                    stroke: {
                        width: 0.5,
                        color: "#fff",
                    },
                },
                opacity: {
                    value: 0.5,
                },
                size: {
                    value: { min: 0.1, max: 1.5 },
                },
                links: {
                    enable: true,
                    distance: 80,
                    color: "#fff",
                    opacity: 0.4,
                    width: 1,
                },
                move: {
                    enable: true,
                    speed: 6,
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
                        enable: true,
                        mode: "repulse",
                    },
                    resize: { enable: true },
                },
                modes: {
                    repulse: {
                        distance: 100,
                        duration: 0.4,
                    },
                },
            },
        }),
        []
    );

    if (!init) return null;

    return <Particles id="tsparticles" options={options} />;
};

export default ParticlesComponent;
