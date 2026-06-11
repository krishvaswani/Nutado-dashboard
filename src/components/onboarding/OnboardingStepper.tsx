"use client";

const STEPS = [
  { pageStep: 1, label: "Details" },
  { pageStep: 2, label: "Occasion" },
  { pageStep: 3, label: "Box type" },
  { pageStep: 6, label: "Message" },
  { pageStep: 7, label: "Review" },
];

interface StepperProps {
  currentStep: number;
}

export default function OnboardingStepper({ currentStep }: StepperProps) {
  return (
    <div className="w-full px-6 pt-5 pb-2">
      <div className="flex items-start gap-0.5">
        {STEPS.map((step) => {
          const isDone = step.pageStep < currentStep;
          const isCurrent = step.pageStep === currentStep;
          const isActive = isDone || isCurrent;

          return (
            <div key={step.pageStep} className="flex-1 flex flex-col gap-1.5 min-w-0">
              {/* Bar */}
              <div
                className={`h-[5px] w-full rounded-full transition-colors duration-300 ${
                  isActive ? "bg-[#ec2626]" : "bg-gray-200"
                }`}
              />
              {/* Label */}
              <span
                className={`text-[11px] font-medium truncate ${
                  isCurrent ? "text-gray-700 font-semibold" : "text-gray-400"
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
