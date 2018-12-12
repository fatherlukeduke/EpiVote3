

export interface VoteChoice {
    voteChoiceID : number,
    voteChoiceDescription : string,
    smiley : string,
    colour : string 
}

export interface MeetingPatientQuestion {
    meetingPatientQuestionID : number,
    meetingID : number,
    patientNumber : number,
    questionNumber : number,
    questionText : number,
    votingOpen : boolean
}

export interface Role {
    roleID : number,
    roleName: string
}

export interface Vote {
    voteChoiceID : number,
    meetingPatientQuestionID: number,
    roleID : number
}

export interface VoteMessage {
    body:string,
    meetingID: number,
    meetingPatientQuestionID: number,
    patientNumber: number,
    questionNumber: number,
    questionText: string,
    title:string,
    votingOpen: string,
    wasTapped: boolean
}

export interface VoteResults {
    stonglyAgree: number,
    agree: number,
    neutral: number,
    disagree: number,
    stronglyDisagree: number,
    average: number
}