import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, Plus, Trash2, Clock } from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';
import AxiosInstance from '@/util/AxiosInstance';

const PomodoroSession = () => {
    const { user, getLocalDate } = useAuth()

    // Timer State
    const [mode, setMode] = useState<'focus' | 'short' | 'long'>('focus');
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);

    // Task State
    const [tasks, setTasks] = useState<{ id: number; text: string; completed: boolean }[]>([]);
    const [newTask, setNewTask] = useState('');

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const CIRCUMFERENCE = 565.48; // 2 * PI * 90
    const MODES = {
        focus: { label: 'Focus time', minutes: 25, color: 'text-black' },
        short: { label: 'Short break', minutes: 5, color: 'text-black' },
        long: { label: 'Long break', minutes: 15, color: 'text-black' }
    };

    const hasBeenCompleted = useRef(false)
    const sessionComplete = async () => {
        try {
            await AxiosInstance.post("/activity/match", {
                "activity_type": "pomodoro",
                "date": getLocalDate(0),
                "user_id": user?.user_id || ""
            })
        }
        catch (e: any) {
            console.log(e.response)
        }
    }

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        }
        else if (timeLeft === 0) {
            if (mode === "focus" && !hasBeenCompleted.current) sessionComplete()
            hasBeenCompleted.current = true
            setIsActive(false);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isActive, timeLeft]);

    const toggleTimer = () => {
        hasBeenCompleted.current = false
        if (timeLeft === 0) resetTimer()
        setIsActive(!isActive)
    };

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(MODES[mode].minutes * 60);
    };

    const changeMode = (newMode: 'focus' | 'short' | 'long') => {
        setMode(newMode);
        setIsActive(false);
        setTimeLeft(MODES[newMode].minutes * 60);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const calculateDashOffset = () => {
        const totalTime = MODES[mode].minutes * 60;
        const progress = (totalTime - timeLeft) / totalTime;
        return progress * CIRCUMFERENCE;
    };

    // Task Functions
    const addTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.trim()) return;
        setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
        setNewTask('');
    };

    const toggleTask = (id: number) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const deleteTask = (id: number) => {
        setTasks(tasks.filter(t => t.id !== id));
    };
    return (
        <main className="flex-1 overflow-auto hero-bg">
            <div className="h-full p-8 flex justify-center items-center">
                <div className="w-full max-w-6xl grid 
                                    grid-cols-1 lg:grid-cols-2 
                                    gap-16 items-start">

                    {/* Timer Section */}
                    <div className="text-center w-full flex flex-col items-center">
                        <h2 className="text-3xl font-bold mb-12">
                            Pomodoro Timer
                        </h2>

                        {/* Timer Circle */}
                        <div className="relative w-80 h-80 mx-auto mb-12">
                            <svg className="w-full h-full drop-shadow-[0_0_20px_rgba(99,102,241,0.3)] 
                                                transform -rotate-90" viewBox="0 0 200 200">
                                {/* Background Circle */}
                                <circle
                                    cx="100"
                                    cy="100"
                                    r="90"
                                    fill="none"
                                    stroke="#e2e8f0"
                                    strokeWidth="8"
                                />
                                {/* Progress Circle */}
                                <circle
                                    cx="100"
                                    cy="100"
                                    r="90"
                                    fill="none"
                                    stroke="#a2a2a2ff"
                                    strokeWidth="8"
                                    strokeDasharray={CIRCUMFERENCE}
                                    strokeDashoffset={calculateDashOffset()}
                                    strokeLinecap="round"
                                    className="transition-[stroke-dashoffset] 
                                                   duration-1000 ease-linear"
                                />
                            </svg>

                            <div className="absolute inset-0 flex flex-col 
                                                items-center justify-center">
                                <div className="text-6xl font-bold tabular-nums 
                                                    mb-2 text-slate-800">
                                    {formatTime(timeLeft)}
                                </div>

                                <div className={`text-lg font-medium opacity-80 ${MODES[mode].color}`}>
                                    {MODES[mode].label}
                                </div>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex gap-4 justify-center mb-8">
                            <button
                                onClick={toggleTimer}
                                className="inline-flex items-center 
                                               w-full sm:w-auto justify-center
                                               px-10 py-4 rounded-full 
                                               text-base sm:text-lg md:text-xl
                                               font-semibold hover:opacity-90 
                                               hover:scale-105 transition-all
                                               shadow-lg text-gray-600"
                            >
                                {isActive ? <Pause className="w-5 h-5" />
                                    : <Play className="w-5 h-5" />}

                                <span>{isActive ? 'Pause' : 'Start'}</span>
                            </button>

                            <button
                                onClick={resetTimer}
                                className="inline-flex items-center 
                                               w-full sm:w-auto justify-center
                                               px-10 py-4 rounded-full 
                                               text-base sm:text-lg md:text-xl
                                               font-semibold hover:opacity-90 
                                               hover:scale-105 transition-all
                                               shadow-lg text-gray-600"
                            >
                                <RotateCcw className="w-5 h-5" />
                                <span>Reset</span>
                            </button>
                        </div>

                        {/* Session type selector */}
                        <div className="flex gap-2 justify-center">
                            {(Object.keys(MODES) as Array<keyof typeof MODES>).map((m) => (
                                <button
                                    key={m}
                                    onClick={() => changeMode(m)}
                                    className="inline-flex items-center 
                                                   w-full sm:w-auto justify-center
                                                   py-5 px-8 rounded-full 
                                                   text-base sm:text-lg md:text-xl
                                                   font-semibold hover:opacity-90 
                                                   hover:scale-105 transition-all
                                                   shadow-lg text-gray-600"
                                >
                                    {MODES[m].label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tasks Section (Integrated) */}
                    <div className="w-full h-full flex flex-col justify-center">
                        <div className="bg-slate-50 rounded-2xl p-8 
                                            border border-slate-100 
                                            h-[500px] flex flex-col">

                            <h3 className="text-xl font-bold mb-6 
                                               flex items-center gap-2">
                                <CheckCircle className="w-6 h-6" />
                                Session goals
                            </h3>

                            <div className="flex-1 overflow-y-auto mb-6 
                                                space-y-3 pr-2 custom-scrollbar">
                                {tasks.map(task => (
                                    <div
                                        key={task.id}
                                        className={`group flex items-center 
                                                        justify-between p-4 rounded-xl 
                                                        border transition-all 
                                                        ${task.completed
                                                ? 'bg-slate-100 border-slate-200'
                                                : 'bg-white border-slate-200 shadow-sm'
                                            }`}
                                    >
                                        <div
                                            className="flex items-center gap-3 
                                                           cursor-pointer flex-1"
                                            onClick={() => toggleTask(task.id)}
                                        >
                                            <div className={`w-6 h-6 rounded-full border-2 
                                                                 flex items-center justify-center 
                                                                 transition-colors 
                                                                 ${task.completed
                                                    ? 'bg-black border-black'
                                                    : 'border-slate-300 group-hover:border-black'
                                                }`}>
                                                {task.completed && <CheckCircle className="w-4 h-4 text-white" />}
                                            </div>

                                            <span className={`text-lg 
                                                                  ${task.completed
                                                    ? 'line-through text-slate-400'
                                                    : 'text-slate-700'}`}>
                                                {task.text}
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => deleteTask(task.id)}
                                            className="text-slate-400 hover:text-red-500 
                                                           opacity-0 group-hover:opacity-100 
                                                           transition-opacity p-2"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}

                                {tasks.length === 0 && (
                                    <div className="h-full flex flex-col 
                                                        items-center justify-center 
                                                        text-slate-400">
                                        <div className="w-16 h-16 bg-slate-200 
                                                            rounded-full flex items-center 
                                                            justify-center mb-4">
                                            <CheckCircle className="w-8 h-8 text-slate-400" />
                                        </div>

                                        <p>No tasks yet.</p>

                                        <p className="text-sm">
                                            Add one to get started!
                                        </p>
                                    </div>
                                )}
                            </div>

                            <form onSubmit={addTask} className="flex gap-2">
                                <input
                                    type="text"
                                    value={newTask}
                                    onChange={(e) => setNewTask(e.target.value)}
                                    placeholder="Add a new task..."
                                    className="flex-1 px-3 py-3 rounded-xl 
                                                   bg-white border border-slate-200 
                                                   focus:outline-none focus:ring-2 
                                                   focus:ring-black-500/50 shadow-lg
                                                   placeholder:text-lg"
                                />

                                <button
                                    type="submit"
                                    disabled={!newTask.trim()}
                                    className="p-3 bg-black text-white 
                                                   rounded-xl hover:bg-black-700 
                                                   disabled:opacity-50 shadow-md
                                                   disabled:cursor-not-allowed  
                                                   hover:scale-105
                                                   transition-all active:scale-95"
                                >
                                    <Plus className="w-6 h-6" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default PomodoroSession