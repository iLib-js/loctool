//
//  PhoenixStrings.swift
//  ht-iosphoenix
//
//  Created by HealthTap on 3/8/17.
//  Copyright © 2017 HealthTap. All rights reserved.
//

import Foundation

class PNXStrings {
    //App Urls
    static let UrlAuthenticationCodeRedirectURI = "pnx://auth"
    
    //App Notification Names and User Info
    static let NotificationAuthenticationCodeReceived = "PNXGotAuthCode"
    static let NotificationAuthenticationCodeReceivedCodeKey = "code"
    
    static let NotificationChatMessageReceived = "ChatMessageReceived"
    static let NotificationChatPersonLeft = "PersonLeftChat"
    static let NotificationChatPersonJoined = "PersonJoinedChat"
    static let NotificationChatMessageKey = "chat_message"
    static let NotificationChatMessageIndex = "index"
    static let NotificationChatPersonKey = "person"

}

class PNXLoginStrings {
    
    static let IntroHeaderString1 = NSLocalizedString("Get quality care", comment:"")
    static let IntroHeaderString2 = NSLocalizedString("Save time", comment:"")
    static let IntroHeaderString3 = NSLocalizedString("Enjoy peace of mind", comment:"")
    
    static let IntroSubheaderString1 = NSLocalizedString("Compassionate medical advice from top medical experts at the Mayo Clinic", comment:"")
    static let IntroSubheaderString2 = NSLocalizedString("Fast and easy access to video/voice/text chat from any computer, tablet, or mobile device", comment: "")
    static let IntroSubheaderString3 = NSLocalizedString("Your medical data and conversations are always private, safe and secure", comment: "")
    
    static let LoginButtonTitle = NSLocalizedString("Login", comment: "")
    static let TermsAndPolicyTitle = NSLocalizedString("By continuing, you agree to HealthTap’s Terms and Privacy Policy", comment: "")    
}

class PNXTabStrings {
    static let notificationsTabTitle = NSLocalizedString("NOTIFICATIONS", comment: "tab bar title")
    static let takeActionTabTitle = NSLocalizedString("TAKE ACTION", comment: "tab bar title")
    static let meTabTitle = NSLocalizedString("ME", comment: "tab bar title")
    static let getHelpTabTitle = NSLocalizedString("GET HELP", comment: "tab bar title")
}

class PNXAppointmentStrings {
    static let UpcomingSectionHeader = NSLocalizedString("UPCOMING", comment: "appointment table view section header")
    static let NowSectionHeader = NSLocalizedString("NOW", comment: "appointment table view section header")
    static let ReasonForVisitHeader = NSLocalizedString("Reason for visit", comment: "appointment table view section header")
    static let StartAppointmentButtonTitle = NSLocalizedString("START", comment: "start button text")
    static let NoAppointmentsMessageHeader = NSLocalizedString("Ah, wonderful!", comment: "message header shown when no appointments in get help feed")
    static let NoAppointmentsMessageSubHeader = NSLocalizedString("You have no upcoming appointments right now. Consider spending your free time sharing a smile with someone.", comment: "message subheader shown when no appointments in get help feed")
}

class PNXMeStrings {
    static let LogoutTitle = NSLocalizedString("Logout", comment: "Logout title")
    static let LoggingOutErrorTitle = NSLocalizedString("Error logging out", comment: "Error logging out title")
    static let LoggingOutErrorMessage = NSLocalizedString("An issue occured trying to log out. Please try again", comment: "Error loggin out message")
    static let DismissButton = NSLocalizedString("Dismiss", comment: "Dismiss button title")
}

class PNXConsultRoomStrings {
    static let WaitingRoomTitle = NSLocalizedString("Waiting room", comment: "Waiting room title")
    static let ChatTitle = NSLocalizedString("Chat", comment: "Chat title")
    static let LiveCallTitle = NSLocalizedString("Live Call", comment: "Live Call title")
}

class PNXChatStrings {
    static let AddActionSheetTitle = NSLocalizedString("Options", comment: "Add Action sheet title")
    static let AddActionSheetMessage = NSLocalizedString("Options", comment: "Add Action sheet message")
    static let AddActionSheetCancelAction = NSLocalizedString("Cancel", comment: "Cancel Action")
}
