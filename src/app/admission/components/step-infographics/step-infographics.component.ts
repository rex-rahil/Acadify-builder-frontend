import { Component, Input } from "@angular/core";

@Component({
  selector: "app-step-infographics",
  templateUrl: "./step-infographics.component.html",
  styleUrls: ["./step-infographics.component.scss"],
})
export class StepInfographicsComponent {
  @Input() stepIndex: number = 0;

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = this.getFallbackImage();
    }
  }

  private getFallbackImage(): string {
    const fallbackImages = [
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzBfMSIgeDE9IjAiIHkxPSIwIiB4Mj0iNDAwIiB5Mj0iMzAwIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iIzg3Q0VFQiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzQ5QTBGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMF8xKSIvPjxjaXJjbGUgY3g9IjIwMCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IndoaXRlIi8+PHJlY3QgeD0iMTYwIiB5PSIxNDAiIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgcng9IjEwIiBmaWxsPSJ3aGl0ZSIvPjx0ZXh0IHg9IjIwMCIgeT0iMjUwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5QZXJzb25hbCBEZXRhaWxzPC90ZXh0Pjwvc3ZnPg==",
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzBfMSIgeDE9IjAiIHkxPSIwIiB4Mj0iNDAwIiB5Mj0iMzAwIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iIzg3Q0VFQiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzIwQjJBQSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMF8xKSIvPjxjaXJjbGUgY3g9IjE1MCIgY3k9IjEwMCIgcj0iMzAiIGZpbGw9IndoaXRlIi8+PGNpcmNsZSBjeD0iMjUwIiBjeT0iMTAwIiByPSIzMCIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIyMDAiIGN5PSIxNjAiIHI9IjMwIiBmaWxsPSJ3aGl0ZSIvPjx0ZXh0IHg9IjIwMCIgeT0iMjUwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5DYXRlZ29yeSAmIEVsaWdpYmlsaXR5PC90ZXh0Pjwvc3ZnPg==",
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzBfMSIgeDE9IjAiIHkxPSIwIiB4Mj0iNDAwIiB5Mj0iMzAwIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iIzg3Q0VFQiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzkzNzBEQiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMF8xKSIvPjxwb2x5Z29uIHBvaW50cz0iMTUwLDgwIDI1MCw4MCAyMjAsNjAgMTgwLDYwIiBmaWxsPSIjRkZENzAwIi8+PHJlY3QgeD0iMTAwIiB5PSIxMjAiIHdpZHRoPSIyMDAiIGhlaWdodD0iMTAiIGZpbGw9IndoaXRlIiByeD0iNSIvPjxyZWN0IHg9IjEwNSIgeT0iMTQwIiB3aWR0aD0iMTkwIiBoZWlnaHQ9IjEwIiBmaWxsPSJ3aGl0ZSIgcng9IjUiLz48dGV4dCB4PSIyMDAiIHk9IjI1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QWNhZGVtaWMgUXVhbGlmaWNhdGlvbnM8L3RleHQ+PC9zdmc+",
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzBfMSIgeDE9IjAiIHkxPSIwIiB4Mj0iNDAwIiB5Mj0iMzAwIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iIzg3Q0VFQiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzMyQ0QzMiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMF8xKSIvPjxwb2x5Z29uIHBvaW50cz0iMjAwLDQwIDEzMCw5MCAyNzAsOTAiIGZpbGw9IiNGRkQ3MDAiLz48cmVjdCB4PSIxNDAiIHk9IjkwIiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjkwIiBmaWxsPSJ3aGl0ZSIvPjxjaXJjbGUgY3g9IjE2MCIgY3k9IjIwMCIgcj0iMTUiIGZpbGw9IiNGRkQ3MDAiLz48Y2lyY2xlIGN4PSIyMDAiIGN5PSIyMDAiIHI9IjE1IiBmaWxsPSIjRkZENzAwIi8+PGNpcmNsZSBjeD0iMjQwIiBjeT0iMjAwIiByPSIxNSIgZmlsbD0iI0ZGRDcwMCIvPjx0ZXh0IHg9IjIwMCIgeT0iMjcwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5GYW1pbHkgU3VwcG9ydDwvdGV4dD48L3N2Zz4=",
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzBfMSIgeDE9IjAiIHkxPSIwIiB4Mj0iNDAwIiB5Mj0iMzAwIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iIzg3Q0VFQiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0ZGRDcwMCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMF8xKSIvPjxyZWN0IHg9IjEwMCIgeT0iNTAiIHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSJ3aGl0ZSIgcng9IjEwIi8+PHBhdGggZD0iTTE2MCA4MFEyMDAgNjAgMjQwIDgwTDIzMCA4MFEyMDAgNzAgMTcwIDgwWiIgZmlsbD0iI0ZGRDcwMCIvPjxjaXJjbGUgY3g9IjIwMCIgY3k9IjkwIiByPSIxMCIgZmlsbD0iI0ZGRDcwMCIvPjx0ZXh0IHg9IjIwMCIgeT0iMjcwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TdWNjZXNzIEFjaGlldmVtZW50PC90ZXh0Pjwvc3ZnPg==",
    ];

    return fallbackImages[this.stepIndex] || fallbackImages[0];
  }

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
