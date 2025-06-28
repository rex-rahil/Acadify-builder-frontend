import { Component, Input } from "@angular/core";

@Component({
  selector: "app-admission-illustrations",
  templateUrl: "./admission-illustrations.component.html",
  styleUrls: ["./admission-illustrations.component.scss"],
})
export class AdmissionIllustrationsComponent {
  @Input() stepIndex: number = 0;

  getStepInfo(): {
    title: string;
    description: string;
    tips: string[];
    imageUrl: string;
    altText: string;
  } {
    const stepInfos = [
      {
        title: "Welcome to Your Journey",
        description:
          "Start your B.Pharm admission process by providing your personal details. This is the first step towards your pharmaceutical career.",
        tips: [
          "Have your documents ready",
          "Use your official name as per certificates",
          "Double-check all contact information",
        ],
        imageUrl: "https://storyset.com/illustration/college-project/amico",
        altText: "College project illustration - Personal Details",
      },
      {
        title: "Eligibility & Categories",
        description:
          "Select your category and confirm eligibility. Understanding requirements ensures a smooth admission process.",
        tips: [
          "Review eligibility criteria carefully",
          "Select appropriate category",
          "Understand reservation policies",
        ],
        imageUrl:
          "https://img.freepik.com/free-vector/team-checking-giant-check-list_23-2148094481.jpg?w=900&t=st=1735408800~exp=1735412400~hmac=example",
        altText: "Team checking checklist - Category & Eligibility",
      },
      {
        title: "Academic Excellence",
        description:
          "Showcase your academic achievements and qualifications. Your educational background is key to admission success.",
        tips: [
          "Calculate percentages accurately",
          "Include all required certificates",
          "Highlight achievements clearly",
        ],
        imageUrl:
          "https://img.freepik.com/free-vector/graduation-concept-illustration_114360-7916.jpg?w=900&t=st=1735408800~exp=1735412400~hmac=example",
        altText: "Graduation celebration - Academic Qualifications",
      },
      {
        title: "Family Support",
        description:
          "Family details and references show your support system. This information helps us understand your background better.",
        tips: [
          "Provide accurate parent information",
          "Choose reliable references",
          "Verify all contact details",
        ],
        imageUrl:
          "https://img.freepik.com/free-vector/happy-family-spending-time-together_74855-14432.jpg?w=900&t=st=1735408800~exp=1735412400~hmac=example",
        altText: "Happy family together - Family Support",
      },
      {
        title: "Complete Your Application",
        description:
          "Upload documents and complete declarations. You're almost there - finish strong to secure your admission!",
        tips: [
          "Upload clear document scans",
          "Read declarations carefully",
          "Review everything before submitting",
        ],
        imageUrl:
          "https://img.freepik.com/free-vector/completed-concept-illustration_114360-3449.jpg?w=900&t=st=1735408800~exp=1735412400~hmac=example",
        altText: "Completion celebration - Documents & Declaration",
      },
    ];

    return stepInfos[this.stepIndex] || stepInfos[0];
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = this.getFallbackImage();
    }
  }

  private getFallbackImage(): string {
    const fallbackImages = [
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjODdDRUVCIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjNDlBMEZGIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9InVybCgjZ3JhZCkiLz48Y2lyY2xlIGN4PSIyMDAiIGN5PSIxMDAiIHI9IjQwIiBmaWxsPSJ3aGl0ZSIvPjxyZWN0IHg9IjE2MCIgeT0iMTQwIiB3aWR0aD0iODAiIGhlaWdodD0iNDAiIGZpbGw9IndoaXRlIiByeD0iNSIvPjx0ZXh0IHg9IjIwMCIgeT0iMjQwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5QZXJzb25hbCBEZXRhaWxzPC90ZXh0Pjwvc3ZnPg==",
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjODdDRUVCIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMjBCMkFBIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9InVybCgjZ3JhZCkiLz48Y2lyY2xlIGN4PSIxNTAiIGN5PSIxMDAiIHI9IjMwIiBmaWxsPSJ3aGl0ZSIvPjxjaXJjbGUgY3g9IjI1MCIgY3k9IjEwMCIgcj0iMzAiIGZpbGw9IndoaXRlIi8+PGNpcmNsZSBjeD0iMjAwIiBjeT0iMTgwIiByPSIzMCIgZmlsbD0id2hpdGUiLz48dGV4dCB4PSIyMDAiIHk9IjI0MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q2F0ZWdvcnkgJiBFbGlnaWJpbGl0eTwvdGV4dD48L3N2Zz4=",
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjODdDRUVCIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjOTM3MEREIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9InVybCgjZ3JhZCkiLz48cG9seWdvbiBwb2ludHM9IjE1MCw4MCAyNTAsODAgMjIwLDYwIDE4MCw2MCIgZmlsbD0iI0ZGRDcwMCIvPjxyZWN0IHg9IjEwMCIgeT0iMTIwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwIiBmaWxsPSJ3aGl0ZSIgcng9IjUiLz48dGV4dCB4PSIyMDAiIHk9IjI0MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QWNhZGVtaWMgUXVhbGlmaWNhdGlvbnM8L3RleHQ+PC9zdmc+",
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjODdDRUVCIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMzJDRDMyIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9InVybCgjZ3JhZCkiLz48cG9seWdvbiBwb2ludHM9IjIwMCw0MCAzMCw5MCAyNzAsOTAiIGZpbGw9IiNGRkQ3MDAiLz48cmVjdCB4PSIxNDAiIHk9IjkwIiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjkwIiBmaWxsPSJ3aGl0ZSIvPjxjaXJjbGUgY3g9IjE2MCIgY3k9IjIwMCIgcj0iMTUiIGZpbGw9IiNGRkQ3MDAiLz48Y2lyY2xlIGN4PSIyMDAiIGN5PSIyMDAiIHI9IjE1IiBmaWxsPSIjRkZENzAwIi8+PGNpcmNsZSBjeD0iMjQwIiBjeT0iMjAwIiByPSIxNSIgZmlsbD0iI0ZGRDcwMCIvPjx0ZXh0IHg9IjIwMCIgeT0iMjYwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5GYW1pbHkgU3VwcG9ydDwvdGV4dD48L3N2Zz4=",
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjODdDRUVCIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRkZENzAwIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9InVybCgjZ3JhZCkiLz48cmVjdCB4PSIxMDAiIHk9IjUwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0id2hpdGUiIHJ4PSIxMCIvPjxwYXRoIGQ9Ik0xNjAgODBRMjAwIDYwIDI0MCA4MEwyMzAgODBRMjAwIDcwIDE3MCA4MFoiIGZpbGw9IiNGRkQ3MDAiLz48Y2lyY2xlIGN4PSIyMDAiIGN5PSI5MCIgcj0iMTAiIGZpbGw9IiNGRkQ3MDAiLz48dGV4dCB4PSIyMDAiIHk9IjI2MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q29tcGxldGUgQXBwbGljYXRpb248L3RleHQ+PC9zdmc+",
    ];

    return fallbackImages[this.stepIndex] || fallbackImages[0];
  }
}
