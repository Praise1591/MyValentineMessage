import React, { useState } from 'react';
import { Heart, Sparkles, ArrowRight, Smile, Calendar, Gift, Star, MessageCircleHeart } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from 'recharts';

const OurLittleWorld = () => {
  const [stage, setStage] = useState(0);
  const [answers, setAnswers] = useState({
    butterflies: '',
    dreamMoment: '',
    whatFeelsSpecial: '',
    quietWish: ''
  });

  const handleChange = (field, value) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const next = () => {
    const currentAnswer = Object.values(answers)[stage];
    if (!currentAnswer?.trim()) {
      toast.warn("Just a few words from you would mean the world right now 🌸", {
        position: "top-center",
        theme: "colored",
        autoClose: 4000
      });
      return;
    }
    if (stage < 3) {
      setStage(stage + 1);
    } else {
      setStage(4);
      setTimeout(() => {
        toast.success("Thank you… for letting me show you this 💗", {
          position: "top-center",
          autoClose: 6500,
          hideProgressBar: true
        });
      }, 800);
    }
  };

  const data = [
    { name: 'First message', closeness: 18, label: "your name appeared" },
    { name: 'First long talk', closeness: 42, label: "hours disappeared" },
    { name: 'Today', closeness: answers.quietWish.trim() ? 78 : 65, label: "right now" },
    { name: 'Someday', closeness: 92, label: "if life allows" }
  ];

  const questions = [
    {
      title: "What still gives you butterflies?",
      placeholder: "maybe when my name lights up your screen…",
      field: 'butterflies',
      icon: Smile
    },
    {
      title: "A moment with me you sometimes imagine",
      placeholder: "even if it’s only in your head for now…",
      field: 'dreamMoment',
      icon: Calendar
    },
    {
      title: "Something small I do that feels special to you",
      placeholder: "the way I reply, a certain emoji, remembering something you said…",
      field: 'whatFeelsSpecial',
      icon: MessageCircleHeart
    },
    {
      title: "One quiet wish you have (about us or just for you)",
      placeholder: "no pressure… whatever is true right now",
      field: 'quietWish',
      icon: Gift
    }
  ];

  const currentQ = questions[stage];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-fuchsia-50 to-purple-50 flex items-center justify-center p-4 sm:p-6 md:p-10 relative overflow-hidden">
      {/* gentle floating hearts */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <Heart
            key={i}
            className="absolute text-rose-200 animate-slow-float"
            fill="currentColor"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              fontSize: `${18 + Math.random() * 38}px`,
              animationDelay: `${Math.random() * 14}s`,
              opacity: 0.25 + Math.random() * 0.35,
            }}
          />
        ))}
      </div>

      <div className="relative w-full max-w-2xl bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-rose-100/50 p-6 sm:p-10 md:p-12">
        {stage === 0 && (
          <div className="space-y-10 text-center animate-fade">
            <div className="flex justify-center">
              <Heart className="h-20 w-20 text-rose-500 animate-pulse-soft" fill="#f43f5e40" />
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent leading-tight">
              This is all I have right now
            </h1>

            <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
              <p>
                I don’t have much money for flowers that last a week,<br />
                or dinner in a nice place, or a trip somewhere beautiful.
              </p>
              <p className="font-medium">
                But I have these words… and a few hours of trying to put feelings into code…<br />
                and every message you’ve ever sent me saved in my heart.
              </p>
              <p>
                We’ve never met. We’ve only talked.<br />
                And still — talking to you already feels like one of the nicest things in my life.
              </p>
            </div>

            <button
              onClick={() => setStage(1)}
              className="mt-8 inline-flex items-center gap-3 px-9 py-5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all group"
            >
              Can I show you something small?
              <ArrowRight className="group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        )}

        {stage > 0 && stage <= 3 && currentQ && (
          <div className="space-y-8 animate-fade">
            <div className="flex justify-center">
              <currentQ.icon className="h-16 w-16 sm:h-20 sm:w-20 text-rose-500" strokeWidth={1.8} />
            </div>

            <h2 className="text-2xl sm:text-3xl font-semibold text-rose-800 text-center leading-snug">
              {currentQ.title}
            </h2>

            <textarea
              value={answers[currentQ.field]}
              onChange={e => handleChange(currentQ.field, e.target.value)}
              placeholder={currentQ.placeholder}
              rows={5}
              className="w-full p-5 rounded-2xl border-2 border-rose-200 focus:border-rose-400 bg-white/60 backdrop-blur-sm text-gray-800 placeholder-gray-500/70 text-base sm:text-lg resize-none shadow-inner focus:shadow-rose-200/60 outline-none transition-all"
            />

            <div className="flex justify-center pt-4">
              <button
                onClick={next}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all group text-base sm:text-lg"
              >
                {stage === 3 ? "Let me see it all together" : "Next gentle step"}
                <ArrowRight className="group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {stage === 4 && (
          <div className="space-y-10 animate-fade">
            <div className="text-center">
              <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-6">
                This is us… so far
              </h2>
              <p className="text-lg text-gray-700">
                A tiny line that keeps going up — because of you.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-5 sm:p-7 shadow-lg border border-rose-100">
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="heartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.7} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#fecdd3" />
                  <XAxis dataKey="name" stroke="#9f1239" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} stroke="#9f1239" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255,255,255,0.96)',
                      borderRadius: '12px',
                      border: '1px solid #fda4af',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="closeness"
                    stroke="#e11d48"
                    fill="url(#heartGradient)"
                    strokeWidth={2.5}
                  />
                  <ReferenceLine y={80} label={{ value: "Getting closer", position: 'insideTopRight', fill: '#9f1239', fontSize: 13 }} stroke="#c026d3" strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm sm:text-base">
              {Object.entries(answers).map(([key, text]) => (
                text.trim() && (
                  <div key={key} className="bg-gradient-to-br from-rose-50 to-pink-50 p-5 rounded-2xl border border-rose-100 shadow-sm">
                    <div className="font-medium text-rose-700 capitalize mb-1.5">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <p className="text-gray-700 leading-relaxed">{text}</p>
                  </div>
                )
              ))}
            </div>

            <div className="pt-6 text-center text-gray-700 leading-relaxed">
              <p className="text-lg font-medium text-rose-700 mb-4">
                Thank you for every reply, every emoji, every tiny moment you shared.
              </p>
              <p>
                This page — this silly little graph — is not expensive.<br />
                But it is honest.<br />
                And it was made with someone I really like… in mind.
              </p>
            </div>
          </div>
        )}
      </div>

      <ToastContainer position="top-center" theme="colored" limit={2} newestOnTop />

      <style jsx global>{`
        @keyframes slow-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50%      { transform: translateY(-50px) rotate(10deg); }
        }
        .animate-slow-float {
          animation: slow-float 22s ease-in-out infinite;
        }
        .animate-pulse-soft {
          animation: pulse 4s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50%      { opacity: 1; transform: scale(1.15); }
        }
        .animate-fade {
          animation: fadeIn 0.9s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default OurLittleWorld;