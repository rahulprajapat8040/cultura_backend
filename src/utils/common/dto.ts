
export class SignupDto {
    fullName: string
    email: string
    phoneNo: string
    countryCode: string
    dob: string
    gender: 'male' | 'female'
    otp: string
    deviceId: string
    deviceToken: string
}

export class LoginDto {
    deviceId: string
    deviceToken: string
    countryCode: string
    phoneNo: string
    otp: string
}

export class VenueRatingDto {
    venueId: string
    review: string
    rating: number
}

export class EventDto {
    slug: string
    eventName: string
    description: string
    maxTickets: number
    ticketPrice: number
    startDate: string
    endDate: string
    isFree: boolean
}