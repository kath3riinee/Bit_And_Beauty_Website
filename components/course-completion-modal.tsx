"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Trophy, Sparkles } from "lucide-react"

interface CourseCompletionModalProps {
  isOpen: boolean
  courseTitle: string
  onClose: () => void
}

export function CourseCompletionModal({ isOpen, courseTitle, onClose }: CourseCompletionModalProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShow(true)
    }
  }, [isOpen])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {/* Fireworks */}
      <div className="fireworks-container">
        <div className="firework" style={{ left: "20%", animationDelay: "0s" }} />
        <div className="firework" style={{ left: "40%", animationDelay: "0.5s" }} />
        <div className="firework" style={{ left: "60%", animationDelay: "1s" }} />
        <div className="firework" style={{ left: "80%", animationDelay: "1.5s" }} />
        <div className="firework" style={{ left: "30%", animationDelay: "2s" }} />
        <div className="firework" style={{ left: "70%", animationDelay: "2.5s" }} />
      </div>

      {/* Modal Content */}
      <div className="relative bg-card border border-border rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 animate-in zoom-in-95 duration-300">
        <div className="text-center">
          {/* Trophy Icon */}
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <Trophy className="w-10 h-10 text-primary" />
          </div>

          {/* Congratulations Text */}
          <h2 className="text-3xl font-bold mb-2 text-balance">
            Congratulations! <Sparkles className="inline w-6 h-6 text-primary" />
          </h2>
          <p className="text-lg text-muted-foreground mb-6">You've completed</p>
          <p className="text-xl font-semibold mb-8 text-balance">{courseTitle}</p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Link href="/courses" className="w-full">
              <Button className="w-full" size="lg">
                Continue Learning
              </Button>
            </Link>
            <Button variant="outline" onClick={onClose} className="w-full bg-transparent">
              Close
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .fireworks-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
        }

        .firework {
          position: absolute;
          top: 50%;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          animation: firework 2s ease-out infinite;
        }

        @keyframes firework {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
            box-shadow:
              0 0 0 0 hsl(var(--primary)),
              0 0 0 0 hsl(var(--primary)),
              0 0 0 0 hsl(var(--primary)),
              0 0 0 0 hsl(var(--primary)),
              0 0 0 0 hsl(var(--primary)),
              0 0 0 0 hsl(var(--primary));
          }
          50% {
            transform: translateY(-200px) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-200px) scale(0);
            opacity: 0;
            box-shadow:
              0 -50px 20px 10px hsl(var(--primary) / 0.8),
              50px -25px 20px 10px hsl(45 100% 50% / 0.8),
              -50px -25px 20px 10px hsl(120 100% 50% / 0.8),
              0 25px 20px 10px hsl(200 100% 50% / 0.8),
              35px 35px 20px 10px hsl(280 100% 50% / 0.8),
              -35px 35px 20px 10px hsl(320 100% 50% / 0.8);
          }
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-bounce {
          animation: bounce 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
