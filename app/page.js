"use client"
import {useState} from "react";
import {useRef} from 'react';
import {useEffect} from 'react';
import ResolveModal from './components/ResolveModal.jsx'
import Logo from './components/Logo.jsx'
import Confetti from 'react-confetti';

export default function Home() {
    const [options, setOptions] = useState([
        {
            name: 'Pilavcı Fevzi',
            favourable: true,
        },
        {
            name: 'Patsocu Nina',
            favourable: true,
        },
        {
            name: 'Zeytinyağlı Tabakcı Piraye',
            favourable: true,
        },
        {
            name: 'Börekçi',
            favourable: false,
        },
    ])
    const [resolveModalOpen, setResolveModalOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showConfetti, setShowConfetti] = useState(false);
    const formRef = useRef();

    // set in state when the user last resolved an option
    const [lastResolved, setLastResolved] = useState(() => {
        // get the last resolved time from localStorage
        const savedLastResolved = typeof window !== "undefined" ? localStorage.getItem("lastResolved") : null;
        return savedLastResolved ? new Date(savedLastResolved) : null;
    });

    // amount of time to wait before the user can resolve again (in milliseconds)
    const resolveCooldown = 60 * 60 * 1000;  // 1 hour

    // calculate if the cooldown is active
    const now = new Date();
    const cooldownActive = lastResolved && (now - lastResolved < resolveCooldown);

    useEffect(() => {
        // save the last resolved time in localStorage whenever it changes
        if (lastResolved) {
            localStorage.setItem("lastResolved", lastResolved.toISOString());
        } else {
            localStorage.removeItem("lastResolved");
        }
    }, [lastResolved]);

    useEffect(() => {
        let intervalId;

        if (cooldownActive && lastResolved) {
            intervalId = setInterval(() => {
                setCurrentTime(new Date());
            }, 1000);  // update every second
        }

        // cleanup function
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [cooldownActive, lastResolved]); // re-run the effect when cooldownActive or lastResolved changes

    const timeLeft = lastResolved ? new Date(lastResolved.getTime() + resolveCooldown - currentTime.getTime()) : null;

    const formatTime = (time) => {
        if (!time) {
            return '';
        }

        const hours = time.getUTCHours().toString().padStart(2, '0');
        const minutes = time.getUTCMinutes().toString().padStart(2, '0');
        const seconds = time.getUTCSeconds().toString().padStart(2, '0');

        return `${hours}:${minutes}:${seconds}`;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        addOption(event.target.new_option.value, event.target.is_favourable.value)
        formRef.current.reset();
    };

    function addOption(name, favourable) {
        const optionExists = options.some(option => option.name === name);

        if (name && !optionExists) {
            setOptions(options.concat({
                    name: name,
                    favourable: favourable === "Favourable",
                }
            ))
        }
    }

    function removeOption(name) {
        setOptions((prevOptions) =>
            prevOptions.filter((option) => option.name !== name)
        );
    }

    function resolveOptions() {
        const favourableOptions = options.filter(option => option.favourable);
        const regularOptions = options.filter(option => !option.favourable);

        // Check if there are no options available
        if (favourableOptions.length === 0 && regularOptions.length === 0) {
            alert("No options available to select.");
            return;
        }

        // Set the weights for favourable and regular options
        const weights = {
            favourable: 2,  // weight for favourable options
            regular: 1,  // weight for regular options
        };

        // Create an array of all options, each represented by an object containing the option and its weight
        const weightedOptions = [
            ...favourableOptions.map(option => ({option, weight: weights.favourable})),
            ...regularOptions.map(option => ({option, weight: weights.regular})),
        ];

        // Calculate the total weight
        const totalWeight = weightedOptions.reduce((sum, {weight}) => sum + weight, 0);

        // Generate a random number between 0 and the total weight
        const random = Math.random() * totalWeight;

        // Find the option that corresponds to the random number
        let accumulatedWeight = 0;
        const selectedOption = weightedOptions.find(({weight}) => {
            accumulatedWeight += weight;
            return random < accumulatedWeight;
        }).option;

        // Alert the name of the selected option
        setSelectedOption(selectedOption.name);
        setResolveModalOpen(true)
        setShowConfetti(true);
        // set the last resolved time to now
        setLastResolved(new Date());
    }

    return (
        <div className="max-w-md px-4 mx-auto my-16 md:my-32 sm:max-w-3xl accent-orange-400">
            {cooldownActive ? (
                <div className="my-auto">
                    <Logo/>
                    <p className="text-center mt-8 text-balance">
                        <small
                            className="text-base animate-ping text-orange-600 font-medium">{formatTime(timeLeft)}</small>
                        <p className="mt-4 italic">Wait you must to consult Resolver</p>
                        <p className="hidden sm:block bg-gray-50 rounded-xl bg-black">
                            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⣤⠤⠐⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡌⡦⠊⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⣼⡊⢀⠔⠀⠀⣄⠤⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⣤⣄⣀⠀
                            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣶⠃⠉⠡⡠⠤⠊⠀⠠⣀⣀⡠⠔⠒⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣾⣿⢟⠿⠛⠛⠁
                            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⡇⠀⠀⠀⠀⠑⠶⠖⠊⠁⠀⠀⠀⡀⠀⠀⠀⢀⣠⣤⣤⡀⠀⠀⠀⠀⠀⢀⣠⣤⣶⣿⣿⠟⡱⠁⠀⠀⠀⠀
                            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⣾⣿⡇⠀⢀⡠⠀⠀⠀⠈⠑⢦⣄⣀⣀⣽⣦⣤⣾⣿⠿⠿⠿⣿⡆⠀⠀⢀⠺⣿⣿⣿⣿⡿⠁⡰⠁⠀⠀⠀⠀⠀
                            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⣿⣿⣧⣠⠊⣠⣶⣾⣿⣿⣶⣶⣿⣿⠿⠛⢿⣿⣫⢕⡠⢥⣈⠀⠙⠀⠰⣷⣿⣿⣿⡿⠋⢀⠜⠁⠀⠀⠀⠀⠀⠀
                            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⢿⣿⣿⣿⣿⣰⣿⣿⠿⣛⡛⢛⣿⣿⣟⢅⠀⠀⢿⣿⠕⢺⣿⡇⠩⠓⠂⢀⠛⠛⠋⢁⣠⠞⠁⠀⠀⠀⠀⠀⠀⠀⠀
                            ⠘⢶⡶⢶⣶⣦⣤⣤⣤⣤⣤⣀⣀⣀⣀⡀⠀⠘⣿⣿⣿⠟⠁⡡⣒⣬⢭⢠⠝⢿⡡⠂⠀⠈⠻⣯⣖⣒⣺⡭⠂⢀⠈⣶⣶⣾⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                            ⠀⠀⠙⠳⣌⡛⢿⣿⣿⣿⣿⣿⣿⣿⣿⣻⣵⣨⣿⣿⡏⢀⠪⠎⠙⠿⣋⠴⡃⢸⣷⣤⣶⡾⠋⠈⠻⣶⣶⣶⣷⣶⣷⣿⣟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                            ⠀⠀⠀⠀⠈⠛⢦⣌⡙⠛⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡀⠀⠀⠩⠭⡭⠴⠊⢀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⣿⣿⡇⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                            ⠀⠀⠀⠀⠀⠀⠀⠈⠙⠓⠦⣄⡉⠛⠛⠻⢿⣿⣿⣿⣷⡀⠀⠀⠀⠀⢀⣰⠋⠀⠀⠀⠀⠀⣀⣰⠤⣳⣿⣿⣿⣿⣟⠑⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠓⠒⠒⠶⢺⣿⣿⣿⣿⣦⣄⣀⣴⣿⣯⣤⣔⠒⠚⣒⣉⣉⣴⣾⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠛⠹⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣭⣉⣉⣤⣿⣿⣿⣿⣿⣿⡿⢀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⡁⡆⠙⢶⣀⠀⢀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀
                            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣴⣶⣾⣿⣟⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⢛⣩⣴⣿⠇⡇⠸⡆⠙⢷⣄⠻⣿⣦⡄⠀⠀⠀⠀⠀⠀
                            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⣿⣿⣿⣿⣿⣿⣎⢻⣿⣿⣿⣿⣿⣿⣿⣭⣭⣭⣵⣶⣾⣿⣿⣿⠟⢰⢣⠀⠈⠀⠀⠙⢷⡎⠙⣿⣦⠀⠀⠀⠀⠀
                            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⣿⣿⣿⣿⣿⣿⣿⡟⣿⡆⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠿⠟⠛⠋⠁⢀⠇⢸⡇⠀⠀⠀⠀⠈⠁⠀⢸⣿⡆⠀⠀⠀⠀
                            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡜⡿⡘⣿⣿⣿⣿⣿⣶⣶⣤⣤⣤⣤⣤⣤⣤⣴⡎⠖⢹⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⣷⡄⠀⠀⠀
                            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡀⠘⢿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠿⠛⠋⡟⠀⠀⣸⣷⣀⣤⣀⣀⣀⣤⣤⣾⣿⣿⣿⠀⠀⠀
                            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣭⣓⡲⠬⢭⣙⡛⠿⣿⣿⣶⣦⣀⠀⡜⠀⠀⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀
                            ⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣭⣛⣓⠶⠦⠥⣀⠙⠋⠉⠉⠻⣄⣀⣸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀
                            ⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣶⣆⠐⣦⣠⣷⠊⠁⠀⠀⡭⠙⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡆⠀⠀
                            ⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⢉⣛⡛⢻⡗⠂⠀⢀⣷⣄⠈⢆⠉⠙⠻⢿⣿⣿⣿⣿⣿⠇⠀⠀
                            ⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⡟⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⣉⢁⣴⣿⣿⣿⣾⡇⢀⣀⣼⡿⣿⣷⡌⢻⣦⡀⠀⠈⠙⠛⠿⠏⠀⠀⠀
                            ⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⣿⡄⠙⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠛⠛⠛⢯⡉⠉⠉⠉⠉⠛⢼⣿⠿⠿⠦⡙⣿⡆⢹⣷⣤⡀⠀⠀⠀⠀⠀⠀⠀
                            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⠿⠄⠈⠻⠿⠿⠿⠿⠿⠿⠛⠛⠿⠛⠉⠁⠀⠀⠀⠀⠀⠀⠻⠿⠿⠿⠿⠟⠉⠀⠀⠤⠴⠶⠌⠿⠘⠿⠿⠿⠿⠶⠤⠀⠀⠀⠀
                        </p>
                    </p>
                </div>
            ) : (
                <>
                    <div>
                        <div className="text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg"
                                 viewBox="0 0 24 24" fill="currentColor">
                                <path fillRule="evenodd"
                                      d="M2.25 4.125c0-1.036.84-1.875 1.875-1.875h5.25c1.036 0 1.875.84 1.875 1.875V17.25a4.5 4.5 0 11-9 0V4.125zm4.5 14.25a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z"
                                      clipRule="evenodd"/>
                                <path
                                    d="M10.719 21.75h9.156c1.036 0 1.875-.84 1.875-1.875v-5.25c0-1.036-.84-1.875-1.875-1.875h-.14l-8.742 8.743c-.09.089-.18.175-.274.257zM12.738 17.625l6.474-6.474a1.875 1.875 0 000-2.651L15.5 4.787a1.875 1.875 0 00-2.651 0l-.1.099V17.25c0 .126-.003.251-.01.375z"/>
                            </svg>
                            <h2 className="mt-2 text-lg font-medium text-gray-900">Add possible options</h2>
                            <p className="mt-1 text-sm text-gray-500">
                                {options.length === 0 ? (
                                    'You haven’t added any options'
                                ) : options.length > 1 ? (
                                    'You have added multiple options, let the better option win!'
                                ) : (
                                    'You have added only one option, you want it that much?'
                                )}
                            </p>
                        </div>
                        <form ref={formRef} onSubmit={handleSubmit} className="mt-6 sm:flex sm:items-center" action="#">
                            <div className="relative rounded-md shadow-sm sm:min-w-0 sm:flex-1">
                                <label htmlFor="new_option" className="sr-only">Option</label>
                                <input
                                    type="text"
                                    name="new_option"
                                    id="new_option"
                                    required
                                    className="focus:ring-orange-400 focus:border-orange-400 block w-full pr-32 sm:text-sm border-gray-300 rounded-md"
                                    placeholder="Enter an option"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center">
                                    <span className="h-4 w-px bg-gray-200" aria-hidden="true"/>
                                    <label htmlFor="is_favourable" className="sr-only">
                                        Type
                                    </label>
                                    <select
                                        id="is_favourable"
                                        name="is_favourable"
                                        className="focus:ring-orange-400 focus:border-orange-400 h-full py-0 pl-4 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md"
                                    >
                                        <option>Regular</option>
                                        <option>Favourable</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-6 sm:mt-0 sm:ml-4 sm:flex-shrink-0">
                                <button
                                    type="submit"
                                    className="block w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Add Option
                                </button>
                            </div>
                            <div className="mt-3 sm:mt-0 sm:ml-4 sm:flex-shrink-0">
                                <button
                                    type="button"
                                    onClick={resolveOptions}
                                    disabled={options.length === 0}
                                    className="block w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-400 disabled:bg-gray-400 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                >
                                    Resolve!
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="mt-10">
                        {options.length > 0 &&
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Possible
                                options</h3>}
                        <ul role="list" className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {options.map((option, optionIdx) => (
                                <li key={optionIdx}
                                    tabIndex="0"  // make the item focusable
                                    onKeyDown={(e) => {
                                        if (e.key === 'Delete' || e.key === 'Backspace') {
                                            removeOption(option.name);
                                        }
                                    }}
                                    className="cursor-pointer group p-2 w-full flex items-center justify-between rounded-full border border-gray-300 shadow-sm space-x-3 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400">
                                    <span className="min-w-0 flex-1 flex items-center space-x-3 text-sm">
                                      <span
                                          className="block flex-shrink-0 ml-1 rounded-full bg-gray-100 py-1 px-2 ml-3">
                                        {optionIdx + 1}
                                      </span>
                                      <span className="block min-w-0 flex-1">
                                        <span
                                            className="block text-sm font-medium text-gray-900 truncate">{option.name}</span>
                                        <span
                                            className="block text-sm font-medium text-gray-500 truncate">{option.favourable ? 'Favourable' : 'Regular'}</span>
                                      </span>
                                    </span>
                                    <button type="button" onClick={() => removeOption(option.name)}
                                            className="flex-shrink-0 h-10 w-10 inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                                        <svg className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                             xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path
                                                d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/>
                                        </svg>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
            {showConfetti && (
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    recycle={false}
                    numberOfPieces={200}
                    gravity={0.2}
                />
            )}
            {resolveModalOpen &&
                <ResolveModal isOpen={resolveModalOpen}
                              onClose={() => {
                                  setResolveModalOpen(false);
                                  setSelectedOption(null);
                              }}
                              selectedOption={selectedOption}/>}
        </div>
    )
}