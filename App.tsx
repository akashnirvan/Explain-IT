import React, { useState, useCallback, useEffect } from 'react';

// --- TYPE DEFINITIONS ---
type Step = {
  stepNumber: number;
  summary: string;
  detailedExplanation: string;
};

type Result = {
  title: string;
  contentType: string;
  summary?: string;
  transcript?: string;
  steps?: Step[];
  audioUrl?: string;
};

type AppView = 'home' | 'loading' | 'results';

// --- SVG ICONS ---

const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10.868 2.884c.321.64.321 1.415 0 2.055l-1.428 2.858a.5.5 0 00.384.805h2.857c.77 0 1.258.82.943 1.52l-1.428 2.857a1.25 1.25 0 01-2.328 0l-1.428-2.857a.5.5 0 00-.384-.805H4.286c-.77 0-1.258-.82-.943-1.52l1.428-2.857a1.25 1.25 0 012.328 0L8.57 5.743a.5.5 0 00.384.805h2.857a.5.5 0 00.384-.805l1.428-2.858a1.25 1.25 0 012.328 0z" clipRule="evenodd" />
    <path d="M10 18a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008A.75.75 0 0110 18zM6.25 15.25a.75.75 0 000 1.5h.008a.75.75 0 000-1.5H6.25zM3.5 11.25a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75V11.25zM13.75 15.25a.75.75 0 000 1.5h.008a.75.75 0 000-1.5h-.008zM16.5 11.25a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75V11.25z" />
  </svg>
);
const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
    <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
  </svg>
);
const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
  </svg>
);
const ProfileIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z" clipRule="evenodd" />
    </svg>
);
const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M2 10a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm6.39-2.908a.75.75 0 0 1 .98 0l4.25 3.5a.75.75 0 0 1 0 1.018l-4.25 3.5a.75.75 0 0 1-.98 0V7.092Z" clipRule="evenodd" />
    </svg>
);
const PauseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M2 10a8 8 0 1 1 16 0 8 8 0 0 1-16 0ZM7.25 6.75a.75.75 0 0 0-.75.75v5a.75.75 0 0 0 1.5 0v-5a.75.75 0 0 0-.75-.75Zm4.5 0a.75.75 0 0 0-.75.75v5a.75.75 0 0 0 1.5 0v-5a.75.75 0 0 0-.75-.75Z" clipRule="evenodd" />
    </svg>
);
const SpinnerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);
const CheckmarkIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
  </svg>
);


// --- HELPER & UI COMPONENTS ---

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  const parseMarkdownToHtml = (markdown: string) => {
    if (!markdown) return '';
    return markdown
      .split('\n\n')
      .map(paragraph => {
        if (paragraph.trim().startsWith('- ')) {
          const items = paragraph.split('\n').map(item => `<li>${item.replace(/^- \s*/, '').trim()}</li>`).join('');
          return `<ul>${items}</ul>`;
        }
        return `<p>${paragraph
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/\n/g, '<br />')
        }</p>`;
      })
      .join('');
  };
  return <div className="text-slate-300 leading-relaxed markdown-summary" dangerouslySetInnerHTML={{ __html: parseMarkdownToHtml(content) }} />;
};

const Header: React.FC = () => (
    <header className="absolute top-0 left-0 right-0 p-4 sm:p-6">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
                ExplainIt
            </h1>
            <div className="w-8 h-8 text-slate-500 hover:text-cyan-400 transition-colors cursor-pointer">
                <ProfileIcon />
            </div>
        </div>
    </header>
);

const AudioPlayer: React.FC<{ src: string }> = ({ src }) => {
    const audioRef = React.useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (audioRef.current) {
            audioRef.current.currentTime = Number(e.target.value);
            setCurrentTime(Number(e.target.value));
        }
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            const setAudioData = () => {
                setDuration(audio.duration);
                setCurrentTime(audio.currentTime);
            };
            const setAudioTime = () => setCurrentTime(audio.currentTime);

            audio.addEventListener('loadeddata', setAudioData);
            audio.addEventListener('timeupdate', setAudioTime);
            
            audio.onended = () => setIsPlaying(false);

            return () => {
                audio.removeEventListener('loadeddata', setAudioData);
                audio.removeEventListener('timeupdate', setAudioTime);
            };
        }
    }, []);

    return (
        <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700 w-full">
            <audio ref={audioRef} src={src} preload="metadata"></audio>
            <button onClick={togglePlayPause} className="text-cyan-400 hover:text-cyan-300 transition-colors">
                {isPlaying ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8" />}
            </button>
            <div className="flex-grow flex items-center gap-3">
                <span className="text-sm font-mono text-slate-400">{formatTime(currentTime)}</span>
                <input
                    type="range"
                    value={currentTime}
                    max={duration || 0}
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-slate-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400"
                />
                <span className="text-sm font-mono text-slate-400">{formatTime(duration)}</span>
            </div>
        </div>
    );
};

// --- VIEW-SPECIFIC COMPONENTS ---

const HomeScreen: React.FC<{ url: string; setUrl: (url: string) => void; handleTranscribe: () => void; error: string | null; isLoading: boolean; }> = ({ url, setUrl, handleTranscribe, error, isLoading }) => (
    <div className="w-full flex flex-col items-center justify-center text-center min-h-screen p-4">
        <div className="w-full max-w-2xl">
            <h2 className="text-3xl sm:text-5xl font-bold text-slate-100">Smart YouTube Transcriber</h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto">
                Paste a YouTube link below to get a summarized, step-by-step guide from any tutorial video.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-2 max-w-xl mx-auto">
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste YouTube URL here"
                    className="flex-grow p-4 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 transition placeholder-slate-500 bg-slate-800/50 text-slate-200 text-lg"
                    disabled={isLoading}
                />
                <button
                    onClick={handleTranscribe}
                    disabled={isLoading || !url.trim()}
                    className="flex items-center justify-center gap-2 text-cyan-400 font-bold py-4 px-6 rounded-lg border-2 border-cyan-400 hover:bg-cyan-400/10 hover:shadow-[0_0_20px_rgba(0,191,255,0.5)] disabled:border-slate-700 disabled:text-slate-500 disabled:hover:shadow-none disabled:cursor-not-allowed transition-all duration-200"
                >
                    <SparklesIcon className="w-6 h-6" />
                    <span className="text-lg">{isLoading ? 'Processing...' : 'Transcribe'}</span>
                </button>
            </div>
             {error && (
                <div className="mt-4 text-center bg-red-900/50 p-3 rounded-lg border border-red-500/50 max-w-xl mx-auto">
                    <p className="font-bold text-red-300">Oops! Something went wrong.</p>
                    <p className="text-sm text-red-400">{error}</p>
                </div>
            )}
        </div>
    </div>
);

const MultiStepLoader: React.FC = () => {
    const [percentage, setPercentage] = useState(0);
    const steps = [
        "Getting transcript",
        "Summarizing content",
        "Crafting key points",
        "Building steps",
        "Preparing output"
    ];

    useEffect(() => {
        const totalDuration = 4000; // Fake load time
        const interval = setInterval(() => {
            setPercentage(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 1;
            });
        }, totalDuration / 100);

        return () => clearInterval(interval);
    }, []);

    const currentStepIndex = Math.min(Math.floor(percentage / (100 / steps.length)), steps.length - 1);

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center text-center p-4 animate-fade-in">
            <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 card-glow flex flex-col items-center">
                <h2 className="text-2xl font-bold text-slate-100">Analyzing Video...</h2>
                <div className="my-8 w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-slate-800 flex items-end justify-center overflow-hidden border-2 border-slate-700">
                    <div 
                      className="w-full bg-gradient-to-t from-cyan-500 to-fuchsia-500 transition-all duration-300 ease-linear"
                      style={{ height: `${percentage}%` }}
                    ></div>
                </div>
                <p className="text-xl text-cyan-400 font-mono mb-8">{percentage}%</p>
                
                <div className="w-full space-y-3 text-left">
                    {steps.map((step, index) => {
                         const isActive = index === currentStepIndex;
                         const isCompleted = index < currentStepIndex || percentage === 100;
                         return (
                            <div key={step} className="flex items-center gap-3 text-sm">
                                <div className="flex-shrink-0">
                                    {isCompleted ? <CheckmarkIcon className="w-5 h-5 text-green-400" /> : (isActive ? <SpinnerIcon className="w-5 h-5 text-cyan-400" /> : <div className="w-5 h-5 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-slate-600"></div></div>)}
                                </div>
                                <span className={`transition-colors ${isCompleted ? 'text-slate-400 line-through' : (isActive ? 'text-cyan-300 font-semibold' : 'text-slate-500')}`}>
                                    {step}
                                </span>
                            </div>
                         )
                    })}
                </div>
            </div>
        </div>
    );
};

const ResultsScreen: React.FC<{ result: Result, handleDownload: () => void, audioSrc: string | null }> = ({ result, handleDownload, audioSrc }) => {
    const StepByStepGuide = ({ steps, summary }: { steps: Step[]; summary?: string }) => (
      <div className="space-y-3">
        {steps.map((step) => (
          <StepCard key={step.stepNumber} step={step} allSteps={steps} overallSummary={summary} />
        ))}
      </div>
    );

    return (
      <main className="w-full max-w-4xl mx-auto px-4 py-24 sm:py-28 animate-fade-in">
        <div className="flex justify-between items-start flex-wrap gap-4 mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">{result.title}</h2>
            <button
                onClick={handleDownload}
                className="flex-shrink-0 flex items-center justify-center gap-2 border border-fuchsia-500 text-fuchsia-500 font-bold py-2 px-4 rounded-lg hover:bg-fuchsia-500/10 transition-colors text-sm"
            >
                <DownloadIcon className="w-4 h-4" />
                <span>Download</span>
            </button>
        </div>

        {audioSrc && <div className="mb-8"><AudioPlayer src={audioSrc} /></div>}
        
        {result.summary && (
            <div className="p-6 bg-slate-800/50 rounded-lg border border-slate-700 mb-8">
                <h3 className="font-semibold text-cyan-400 mb-3 text-lg">Summary</h3>
                <MarkdownRenderer content={result.summary} />
            </div>
        )}
        
        <h3 className="font-semibold text-cyan-400 mb-4 text-lg">Steps</h3>
        {result.contentType === 'Step-by-Step Guide' && result.steps ? (
            <StepByStepGuide steps={result.steps} summary={result.summary} />
        ) : (
            <textarea
                readOnly
                value={result.transcript || 'No transcript available.'}
                className="w-full h-64 p-3 border border-slate-700 rounded-lg bg-slate-800/50 font-mono text-sm text-slate-300 leading-relaxed"
                aria-label="Video Transcript"
            />
        )}
      </main>
    );
};

// --- StepCard (reused in ResultsScreen) ---
const StepCard: React.FC<{ step: Step; allSteps: Step[]; overallSummary?: string }> = ({ step, allSteps, overallSummary }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAiExplainerVisible, setIsAiExplainerVisible] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  
  const handleExplainRequest = useCallback(async (customQuery?: string) => {
    setIsAiLoading(true);
    setAiResponse(null);
    setAiError(null);
    
    let prompt = `The user is on Step ${step.stepNumber}: "${step.summary}". The step details are: "${step.detailedExplanation}".\n\n`;
    if(customQuery) {
        prompt += `The user has a specific question: "${customQuery}". Please provide a detailed explanation addressing their question in the context of this step.`;
    } else {
        prompt += `Please explain this step in much greater detail, as if for a complete beginner. Break down any complex terms and provide more context.`;
    }

    try {
        const response = await fetch('https://akashkumar1111.app.n8n.cloud/webhook/explainer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, allSteps, overallSummary }),
        });
        
        const responseText = await response.text(); 
        if (!response.ok) throw new Error(`The explainer service failed with status: ${response.status}. Response: ${responseText}`);
        
        let explanation;
        try {
            const data = JSON.parse(responseText);
            explanation = data.response || data.text || data.explanation || (typeof data === 'string' ? data : JSON.stringify(data));
        } catch (jsonError) { explanation = responseText; }
        
        if (!explanation || (typeof explanation === 'string' && !explanation.trim())) {
            throw new Error("Received an empty explanation from the server.");
        }
        
        setAiResponse(explanation);
    } catch (e) {
        setAiError(e instanceof Error ? e.message : "An unknown error occurred.");
    } finally {
        setIsAiLoading(false);
    }
  }, [step, allSteps, overallSummary]);

  return (
    <div className="border border-slate-800 rounded-lg transition-all duration-300 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10 bg-slate-800/40">
      <div className="flex items-start gap-4 p-4">
        <div className="flex-shrink-0 w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center font-bold text-cyan-400">
          {step.stepNumber}
        </div>
        <div className="flex-grow">
           <p className="font-bold text-slate-200 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>{step.summary}</p>
          <button onClick={() => setIsExpanded(!isExpanded)} className="flex items-center text-sm text-cyan-400 font-semibold mt-1">
            <span>{isExpanded ? 'Hide Details' : 'Explain Details'}</span>
            <ChevronDownIcon className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
        <button onClick={() => setIsAiExplainerVisible(!isAiExplainerVisible)} className={`p-2 rounded-full transition-colors ${isAiExplainerVisible ? 'bg-cyan-900/50 text-cyan-400' : 'text-slate-500 hover:bg-slate-700'}`} aria-label="Explain with AI">
            <SparklesIcon className="w-5 h-5" />
        </button>
      </div>
      <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <div className="px-4 pb-4 pl-16">
            <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{step.detailedExplanation}</p>
          </div>
        </div>
      </div>
      <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isAiExplainerVisible ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
            <div className="px-4 pb-4 pt-2">
                <div className="border-t border-slate-700 pt-4 space-y-3">
                     <div className="flex items-center gap-2">
                         <input
                            type="text" value={aiQuery} onChange={(e) => setAiQuery(e.target.value)}
                            placeholder="Ask a follow-up question..." disabled={isAiLoading}
                            className="flex-grow p-2 border border-slate-600 rounded-md focus:ring-1 focus:ring-cyan-500 focus:border-cyan-400 text-sm bg-slate-700/50 text-slate-300 placeholder-slate-500"
                        />
                        <button onClick={() => handleExplainRequest(aiQuery)} disabled={isAiLoading || !aiQuery.trim()} className="bg-cyan-500 text-slate-900 font-semibold py-2 px-3 rounded-md text-sm hover:bg-cyan-400 disabled:bg-slate-700 disabled:text-slate-500">
                            Ask AI
                        </button>
                     </div>
                     <button onClick={() => handleExplainRequest()} disabled={isAiLoading} className="w-full text-sm text-cyan-400 font-semibold py-2 px-3 rounded-md hover:bg-cyan-500/10 transition-colors disabled:text-slate-500 disabled:bg-transparent">
                         Explain this step in more detail
                     </button>
                     <div className="pt-2">
                        {isAiLoading && <div className="text-sm text-slate-400 flex items-center gap-2"><svg className="animate-spin h-4 w-4 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Thinking...</div>}
                        {aiError && <div className="text-sm text-red-300 bg-red-900/50 p-3 rounded-md">{aiError}</div>}
                        {aiResponse && (
                          <div className="text-sm bg-slate-900/50 p-3 rounded-md ring-1 ring-slate-700">
                            <MarkdownRenderer content={aiResponse} />
                          </div>
                        )}
                     </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP ORCHESTRATOR ---

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('home');
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);

  useEffect(() => {
    return () => { // Cleanup function
      if (audioSrc) {
        URL.revokeObjectURL(audioSrc);
      }
    };
  }, [audioSrc]);

  const handleTranscribe = useCallback(async () => {
    if (!url.trim()) return;

    setView('loading');
    setIsLoading(true);
    setError(null);
    setResult(null);
    if(audioSrc) URL.revokeObjectURL(audioSrc);
    setAudioSrc(null);

    await new Promise(resolve => setTimeout(resolve, 4500)); 

    try {
        const response = await fetch('https://akashkumar1111.app.n8n.cloud/webhook/explainit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ videoUrl: url }),
        });
        
        const responseText = await response.text();
        if (!responseText) throw new Error("Received an empty response from the server.");
        if (!response.ok) throw new Error(`Server responded with status ${response.status}: ${responseText}`);
        const data = JSON.parse(responseText);

        const sourceData = Array.isArray(data) ? data[0] : data;
        if (!sourceData) throw new Error("Invalid data structure received.");
        
        const steps = sourceData.steps;
        if (!steps || !Array.isArray(steps)) throw new Error("Invalid data format for steps.");
        
        const apiResult: Result = {
            title: sourceData.title || "Transcription Result",
            contentType: "Step-by-Step Guide",
            summary: sourceData.summary,
            steps: steps,
            audioUrl: sourceData.audioUrl,
        };
        setResult(apiResult);
        
        if (apiResult.audioUrl) {
            const audioResponse = await fetch(apiResult.audioUrl);
            if (!audioResponse.ok) throw new Error("Failed to fetch audio file.");
            const audioBlob = await audioResponse.blob();
            setAudioSrc(URL.createObjectURL(audioBlob));
        }

        setView('results');
    } catch (e) {
        setError(`Failed to process video. ${e instanceof Error ? e.message : "An unknown error occurred."}`);
        setView('home');
    } finally {
        setIsLoading(false);
    }
  }, [url, audioSrc]);

  const handleDownload = useCallback(() => {
    if (!result) return;
    const content = `Title: ${result.title}\nSummary: ${result.summary || 'N/A'}\n\n` + 
        result.steps?.map(s => `Step ${s.stepNumber}: ${s.summary}\n${s.detailedExplanation}`).join('\n\n') ?? '';
      
    const blob = new Blob([content], { type: 'text/plain' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    const safeTitle = result.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.download = `${safeTitle}_transcript.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  }, [result]);
  
  const renderView = () => {
    switch(view) {
        case 'loading':
            return <MultiStepLoader />;
        case 'results':
            return result && <ResultsScreen result={result} handleDownload={handleDownload} audioSrc={audioSrc} />;
        case 'home':
        default:
            return <HomeScreen url={url} setUrl={setUrl} handleTranscribe={handleTranscribe} error={error} isLoading={isLoading} />;
    }
  }

  return (
    <div className="min-h-screen font-sans">
      <Header />
      {renderView()}
    </div>
  );
};

export default App;
