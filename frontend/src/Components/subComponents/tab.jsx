
import { Tabs } from "flowbite-react";
import j1 from '../../assets/images/j1.png'
import j2 from '../../assets/images/j2.png'
import j3 from '../../assets/images/j3.png'
import j4 from '../../assets/images/j4.png'
import j5 from '../../assets/images/j5.png'
import j6 from '../../assets/images/j6.png'
import j10 from '../../assets/images/j10.png'
import j11 from '../../assets/images/j11.png'
import j12 from '../../assets/images/j12.png'
import j13 from '../../assets/images/j13.png'

import TabContent from "./tabsContent";

export default function Tab({ first, sec, third }) {
    return (
        <div className="overflow-x-auto">
            <Tabs className="mb-6" aria-label="tabs" variant="fullWidth">
                {
                    first &&
                    <Tabs.Item className="bg-transparent Classico" active title={<span className="bg-transparent Classico">Job Seekers</span>}>

                        <TabContent img={j1} head={'Community'} para={'Connect with other nannies in your area to share experiences, seek advice, and  find support.'} />
                        <TabContent img={j2} head={'Local Meet-ups'} para={'Join local meet-ups organized through Famlink to build friendships and  professional connections.'} />
                        <TabContent img={j3} head={'Discussion Forums'} para={'Participate in online forums to discuss various aspects of caregiving, share  tips, and offer support.'} />
                        <TabContent img={j4} head={'Professional Growth'} para={'Access resources and opportunities for professional development and personal growth.'} />

                    </Tabs.Item>
                }
                {
                    sec &&
                    <Tabs.Item title={<span className="bg-transparent Classico">Families</span>}>

                        <TabContent img={j1} head={'Community'} para={'Join our community of families to share advice, experiences, and build local connections.'} />
                        <TabContent img={j5} head={'Child Care Resources'} para={'Access valuable resources, articles, and tips on various aspects of childcare and parenting.'} />
                        <TabContent img={j6} head={'Parental Support'} para={'Discover support groups and resources to help you navigate the challenges of parenting.'} />

                    </Tabs.Item>
                }

                {
                    third &&
                    <Tabs.Item title={<span className="bg-transparent Classico">Business</span>}>

                        <TabContent img={j10} head={'Customizable Profile'} para={'Showcase your business with a personalized profile including photos, descriptions, and contact information.'} />
                        <TabContent img={j11} head={'Service Listings'} para={'Create multiple service listings to highlight different offerings and attract a diverse clientele.'} />
                        <TabContent img={j12} head={'Review System'} para={'Build trust with potential clients through a transparent review system.'} />
                        <TabContent img={j13} head={'Messaging Platform'} para={'Easily communicate with families through our integrated messaging system.'} />
    
                    </Tabs.Item>
                }


            </Tabs>
        </div>
    );
}
