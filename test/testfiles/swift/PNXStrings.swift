//
//  PNXStrings.swift

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
    
    static let IntroHeaderString1 = NSLocalizedString("Save money", comment:"")
    static let IntroHeaderString2 = NSLocalizedString("Save time", comment:"")
        
    static let LoginButtonTitle = NSLocalizedString("Login", comment: "")
    static let TermsAndPolicyTitle = NSLocalizedString("By continuing, you agree to the Terms and Privacy Policy", comment: "")    
}

class PNXTabStrings {
    static let notificationsTabTitle = NSLocalizedString("NOTIFICATIONS", comment: "tab bar title")
    static let takeActionTabTitle = NSLocalizedString("TAKE ACTION", comment: "tab bar title")
    static let meTabTitle = NSLocalizedString("ME", comment: "tab bar title")
    static let getHelpTabTitle = NSLocalizedString("GET HELP", comment: "tab bar title")
}

class PNXMeStrings {
    static let LogoutTitle = NSLocalizedString("Logout", comment: "Logout title")
    static let LoggingOutErrorTitle = NSLocalizedString("Error logging out", comment: "Error logging out title")
    static let LoggingOutErrorMessage = NSLocalizedString("An issue occurred trying to log out. Please try again", comment: "Error logging out message")
    static let DismissButton = NSLocalizedString("Dismiss", comment: "Dismiss button title")
}

class PNXChatStrings {
    static let AddActionSheetTitle = NSLocalizedString("Options", comment: "Add Action sheet title")
    static let AddActionSheetMessage = NSLocalizedString("Options", comment: "Add Action sheet message")
    static let AddActionSheetCancelAction = NSLocalizedString("Cancel", comment: "Cancel Action")
}
