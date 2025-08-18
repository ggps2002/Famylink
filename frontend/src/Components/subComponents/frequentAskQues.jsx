
import Acc from "./accordian"

export default function FrequentAskQuestion({ faq }) {
    return (
        <div>
            <div className="text-center">
                <p className="Livvic text-4xl font-bold">Frequently Asked Questions</p>
                {/* <p className="text-lg line1-20 my-4 mx-auto add-width">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p> */}
            </div>
            <div className="flex justify-center">
                <Acc faq={faq} />
            </div>
        </div>
    )
}