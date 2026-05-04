"use client";

const STEPS = [
  { id: 1, label: "Details" },
  { id: 2, label: "Occasion" },
  { id: 3, label: "Box type" },
  { id: 4, label: "Products" },
  { id: 5, label: "Message" },
  { id: 6, label: "Message" },
  { id: 7, label: "Review" },
];

interface StepperProps {
  currentStep: number;
}

export default function OnboardingStepper({ currentStep }: StepperProps) {
  return (
    <div className="w-full px-6 pt-5 pb-2">
      <div className="flex items-start gap-0.5">
        {STEPS.map((step) => {
          const isDone = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isActive = isDone || isCurrent;

          return (
            <div key={step.id} className="flex-1 flex flex-col gap-1.5 min-w-0">
              {/* Bar */}
              <div
                className={`h-[5px] w-full rounded-full transition-colors duration-300 ${
                  isActive ? "bg-[#0a6e3a]" : "bg-gray-200"
                }`}
              />
              {/* Label */}
              <span
                className={`text-[11px] font-medium truncate ${
                  isCurrent ? "text-gray-700" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
