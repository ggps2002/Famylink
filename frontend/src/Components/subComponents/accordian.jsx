
import { Accordion, AccordionContent, AccordionPanel, AccordionTitle } from "flowbite-react";

export default function Acc({ faq }) {
    return (
        <Accordion className="acc" style={{ border: "none" }}>
            {
                faq &&
                faq.map((v, i) => (
                    <AccordionPanel key={i} className="margin-top">
                        <AccordionTitle className="margin-top sh" style={{ border: "1px solid #E7E7E7" }}>{i + 1}. {v.question}</AccordionTitle>
                        <AccordionContent style={{ border: "1px solid #E7E7E7" }}>
                            <p className="mb-2 text-gray-500 dark:text-gray-400">
                                {v.answer}
                            </p>
                        </AccordionContent>
                    </AccordionPanel>
                ))
            }
        </Accordion>
    );
}
