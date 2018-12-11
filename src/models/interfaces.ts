

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
    MeetingID: number,
    MeetingPatientQuestionID: number,
    PatientNumber: number,
    QuestionNumber: number,
    QuestionText: string,
    title:string,
    VotingOpen: string,
    wasTapped: boolean
}