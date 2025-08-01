import Sec1 from "../subComponents/sec1";
import Sec3 from "../subComponents/sec3";
import Sec4 from "../subComponents/sec4";
import img from "../../assets/images/img5.png";
import Benefits from "../subComponents/benefitsOfNannySharing";
import ShareNanny from "../subComponents/shareNanny";
import JoinLink from "../subComponents/joinLInk";
import step5 from "../../assets/images/step5.png";
import step6 from "../../assets/images/step6.png";
import step7 from "../../assets/images/step7.png";
import step8 from "../../assets/images/step8.png";
import WorkStep from "../subComponents/worksStep";
import FrequentAskQuestion from "../subComponents/frequentAskQues";
import GetStarted from "../subComponents/getStarted";
import ns1 from "../../assets/images/ns1.png";
import ns2 from "../../assets/images/ns2.png";
import ns3 from "../../assets/images/ns3.png";
import ns4 from "../../assets/images/ns4.png";
import st1 from "../../assets/images/st1.png";
import st2 from "../../assets/images/st2.png";
import st3 from "../../assets/images/st3.png";
import st4 from "../../assets/images/st4.png";
import st5 from "../../assets/images/st5.png";
import { AnimatedWrapper } from "../subComponents/animation";
import NannySharePreview from "../subComponents/nannySharePreview";
import AvailableNanniesSharing from "../subComponents/availableNanniesSharing";
import InventoryNumbers from "../subComponents/nannyShareInventoryNumbers";
import SuccessStories from "../subComponents/successStories";
import SavingsCalculator from "../subComponents/savingsCalculator";

export default function NannyShare() {
  const benefits = [
    {
      icon: ns1,
      title: "Smart Family Matching ",
      description: "Compatible families create successful long-term arrangements. Save $18,000-$26,000 annually.",
    },
    {
      icon: ns2,
      title: "Personalized Care",
      description: "Enjoy tailored childcare services.",
    },
    {
      icon: ns3,
      title: "Social Interaction",
      description: "Children benefit from socializing with peers.",
    },
    {
      icon: ns4,
      title: "Flexible Scheduling",
      description: "Coordinate a schedule that works for both families.",
    },
  ];
  const step1 = [
    {
      title: "Step 1",
      description:
        "Use our platform to find other families interested in nanny sharing.",
      head: "Connect with Families",
      img: st1,
    },
    {
      title: "Step 2",
      description:
        "Create a job listing highlighting your needs and preferences.",
      head: "Post a Job",
      img: st2,
    },
    {
      title: "Step 3",
      description: "Look through our database of qualified nannies.",
      head: "Browse Nanny Profiles",
      img: st3,
    },
    {
      title: "Step 4",
      description:
        "Set up interviews with potential nannies and partner families.",
      head: "Arrange a Meeting",
      img: st4,
    },
    {
      title: "Step 5",
      description: "Agree on a schedule, salary, and other terms.",
      head: "Finalize the Details",
      img: st5,
    },
  ];

  const faq = [
    {
      question: "Can I set my own terms when participating in a nanny share?",
      answer:
        "Yes! Families have full control over their nanny share arrangement, including scheduling, pay-splitting, and responsibilities. Famlink provides tools like cost calculators and agreement templates to make the process seamless. ",
    },
    {
      question:
        "Do I need to have another family lined up before looking for a nanny share?",
      answer:
        "No! You can browse other families looking for a nanny share and connect with those who have similar needs. Our platform helps match families based on location, schedule, and preferences.",
    },
    {
      question: "How do I know if a nanny is open to nanny sharing?",
      answer:
        "Caregiver profiles indicate whether they are open to working in a nanny share arrangement. You can also discuss expectations during the interview process.",
    },
    {
      question:
        "What if one family wants to leave the nanny share arrangement?",
      answer:
        "We recommend using a nanny share agreement to outline how transitions will be handled. Famlink provides templates to help families create a structured arrangement that works for everyone. ",
    },
  ];
  return (
    <div
      className="pb-12"
      style={{
        background:
          "linear-gradient(176.7deg, #FFDCA9 -21.31%, rgba(248, 237, 235, 0.5) 52.57%, rgba(248, 223, 193, 0.2) 100%)",
      }}
    >
      <div className="padd-res">
        <Sec1
          pic={img}
          head={"Find Your Perfect Nanny Share Match"}
          preHead={"Smart family compatibility for successful partnerships"}
          btnText={"Find Nanny Share Opportunities"}
        />

        <div className=" bg-white py-12">
          <NannySharePreview
            head={"Nanny Share Opportunities Near You"}
            type={"NannyShare"}
          />
          <AvailableNanniesSharing />
          <InventoryNumbers />
        </div>

        <div className="bg-white">
          <Sec4
            head={"What is Nanny Sharing?"}
            subHead={
              "Nanny sharing is a childcare arrangement where two or more families hire a single nanny to care for their children together. It combines high-quality care with cost savings and socialization opportunities for the kids."
            }
          />
        </div>

        <div className="bg-white mt-12 py-12">
          <Benefits benefits={benefits} head={"BENEFITS OF NANNY SHARING"} />
        </div>

        <SavingsCalculator head={"Estimate Your Savings"}/>

        <div className="bg-white mt-12 py-12">
          <ShareNanny />
        </div>

        <div className="bg-white mt-12 py-12">
          <JoinLink
            head={"How It Works"}
            subHead={"Benefits of Joining Famlink"}
            head1={"Find a Family"}
            subHead1={
              "Connect with another family in your area looking to share a nanny."
            }
            img1={step5}
            head2={"Hire a Nanny"}
            subHead2={
              "Together, find a qualified nanny who meets both families' needs."
            }
            img2={step6}
            head3={"Set Up a Schedule"}
            subHead3={
              "Coordinate a care schedule that works for both families."
            }
            img3={step7}
            head4={"Share the Cost"}
            subHead4={
              "Split the nanny's salary, making childcare more affordable."
            }
            img4={step8}
            btn={true}
            btnName={"Get Started"}
            link={"/joinNow"}
          />

          <SuccessStories />
        </div>

        <div className="bg-white mt-12 py-12">
          <WorkStep
            steps={step1}
            head={"Getting Started with Nanny Sharing"}
            subHead={
              <>
                Ready to start your nanny share journey?
                <br />
                Follow these simple steps to find the perfect nanny share
                arrangement for your family.
              </>
            }
            btn={true}
            btnText={"Browse Available Opportunities"}
          />
        </div>

        <div className="bg-white mt-12 px-1 py-12">
          <AnimatedWrapper
            animationConfig={{
              from: { opacity: 0, y: -100 },
              to: { opacity: 1, y: 0, duration: 2.5, ease: "power3.out" },
            }}
          >
            <Sec3 sec={true} />
          </AnimatedWrapper>
        </div>

        <div className="bg-white mt-12 px-1 py-12">
          <FrequentAskQuestion faq={faq} />
        </div>

        <div className="justify-center items-center bg-white mt-12 px-12 py-12 text-center">
          <GetStarted
            head={"Get Started"}
            subHead={"Kickstart your nanny share journey today!"}
            btn={"Find Care"}
          />
        </div>
      </div>
    </div>
  );
}
