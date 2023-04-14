/**
 * 
 * Author: Suyash Shrestha
 * Date: 2021-09-10
 * 
 */

import { useState } from "react"

const Step = () => {

    const [steps, setStep] = useState({
        stepsItems: ["Personal", "Employment", "Living Arrangements", "Docs"],
        currentStep: 2
    })

    return (
        <div className="max-w-2xl mx-auto px-4 md:px-0">
            <ul aria-label="Steps" className="items-center text-gray-600 font-medium md:flex">
                {steps.stepsItems.map((item, idx) => (
                    <li aria-current={steps.currentStep == idx + 1 ? "step" : false} className="flex gap-x-3 md:flex-col md:flex-1 md:gap-x-0">
                        <div className="flex flex-col items-center md:flex-row md:flex-1">
                            <hr className={`w-full border hidden md:block ${idx == 0 ? "border-none" : "" || steps.currentStep >= idx + 1 ? "border-indigo-600" : ""}`} />
                            <div className={`w-8 h-8 rounded-full border-2 flex-none flex items-center justify-center ${steps.currentStep > idx + 1 ? "bg-indigo-600 border-indigo-600" : "" || steps.currentStep == idx + 1 ? "border-indigo-600" : ""}`}>
                                <span className={`w-2.5 h-2.5 rounded-full bg-indigo-600 ${steps.currentStep != idx + 1 ? "hidden" : ""}`}></span>
                                {
                                    steps.currentStep > idx + 1 ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                    ) : ""
                                }
                            </div>
                            <hr className={`h-12 border md:w-full md:h-auto ${idx + 1 == steps.stepsItems.length ? "border-none" : "" || steps.currentStep > idx + 1 ? "border-indigo-600" : ""}`} />
                        </div>
                        <div className="h-8 flex justify-center items-center md:mt-3 md:h-auto">
                            <h3 className={`text-sm ${steps.currentStep == idx + 1 ? "text-indigo-600" : ""}`}>
                                {item}
                            </h3>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Step;