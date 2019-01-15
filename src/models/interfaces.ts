

export interface VoteChoice {
    voteChoiceID : number,
    voteChoiceDescription : string,
    smiley : string,
    colour : string,
    voteChoiceValue: number
}

export interface MeetingPatient{
    meetingPatientID : number,
    meetingID : number,
    patientNumber: number,
    votingOpen :  number
}

export interface MeetingPatientQuestion {
    meetingPatientQuestionID : number,
    meetingPatientID : number,
    meetingID : number,
    patientNumber : number,
    questionNumber : number,
    questionText : number,
    votingOpen : boolean,
    votingComplete: boolean
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
    body :string,
    meetingID: number,
    meetingPatientQuestionID: number,
    meetingPatientID : number,
    questionNumber: number,
    questionText: string,
    messageCode : string,
    title : string,
    votingOpen: string,
    wasTapped: boolean
}

export interface VoteResults {
    stronglyAgreeCount : number,
    agreeCount : number,
    neutralCount : number,
    disagreeCount: number,
    stronglyDisagreeCount : number,
    chartData : Array<number>,
    averageScore : number,
    votes : Array<Vote>

}