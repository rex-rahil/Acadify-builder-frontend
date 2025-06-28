import { Component, Input } from "@angular/core";

@Component({
  selector: "app-step-infographics",
  templateUrl: "./step-infographics.component.html",
  styleUrls: ["./step-infographics.component.scss"],
})
export class StepInfographicsComponent {
  @Input() stepIndex: number = 0;

  getStepInfo(): {
    title: string;
    description: string;
    achievements: string[];
    icon: string;
  } {
    const stepInfos = [
      {
        title: "Excellence in Education",
        description:
          "Join Oriental College of Pharmacy - Where academic excellence meets innovative learning. Our state-of-the-art facilities and experienced faculty ensure quality pharmaceutical education.",
        achievements: [
          "50+ Years of Academic Excellence",
          "98% Placement Record",
          "Modern Laboratory Facilities",
        ],
        icon: "excellence",
      },
      {
        title: "Growing Community",
        description:
          "Be part of our thriving academic community. Oriental College has nurtured thousands of successful pharmacists who are now leaders in the pharmaceutical industry.",
        achievements: [
          "5000+ Alumni Network",
          "Industry Partnerships",
          "Research Publications",
        ],
        icon: "community",
      },
      {
        title: "Innovation & Research",
        description:
          "Our college is at the forefront of pharmaceutical research and innovation. Students engage in cutting-edge research projects and industry collaborations.",
        achievements: [
          "Advanced Research Labs",
          "Patent Applications",
          "Industry Collaborations",
        ],
        icon: "innovation",
      },
      {
        title: "Campus Life & Growth",
        description:
          "Experience holistic development with our vibrant campus life. From academics to extracurriculars, we foster an environment for complete personal growth.",
        achievements: [
          "Modern Campus Infrastructure",
          "Student Activities & Clubs",
          "Sports & Cultural Events",
        ],
        icon: "campus",
      },
      {
        title: "Future Success",
        description:
          "Complete your journey with us and step into a successful pharmaceutical career. Our placement support and industry connections ensure bright career prospects.",
        achievements: [
          "100% Placement Assistance",
          "Career Guidance Program",
          "Industry Mentorship",
        ],
        icon: "success",
      },
    ];

    return stepInfos[this.stepIndex] || stepInfos[0];
  }
}
