#import "UIColor+MPColor.h"
#import "UIFont+MPFont.h"
#import "UIView+MPConstraints.h"

#define kPersonInfoXStart             90.0

-(void) updateWithPersonObject:(MPPersonObject *)object withSessionInfo:(MPSessionInfo *)sessionInfo andViewWidth:(CGFloat)viewWidth {
    
    if ([object isKindOfClass:MPFriendObject.class]) {
       
        self.availableImageView.hidden =  ![friend.available isEqualToString:@"available"];
      
        if (sessionInfo.coordinatorId  && [sessionInfo.coordinatorId isEqualToString:object.personId]) {
            self.specialtyLabel.text = NSLocalizedString(@"Staff", nil);
        }
    }
    else {
        if ([sessionInfo.CustomerId isEqualToString:object.personId]) {
            self.specialtyLabel.text = NSLocalizedString(@"Customer", nil);
            self.locationLabel.text = [object getCityState];
        }
        else if (sessionInfo.coordinatorId  && [sessionInfo.coordinatorId isEqualToString:object.personId]) {
            self.specialtyLabel.text = NSLocalizedString(@"Staff", nil);
            self.locationLabel.text = [object getCityState];
        }
    }
    

}

-(void) updateCommandViewWithPersonObject:(MPPersonObject *)person andSessionInfo:(MPSessionInfo *)sessionInfo {
        
    BOOL isOwner = [sessionInfo.soapOwnerId isEqualToString:person.personId];
    if ([sessionInfo.leftPaticipantIdArray containsObject:person.personId] ||
        [self addInfoLabelToCommandView:NSLocalizedString(@"Left question", nil)];
        return;
    }
    
    if (isOwner) {
        [self addInfoLabelToCommandView:NSLocalizedString(@"Owner", @"Owner of the question")];
        return;
    }
    
    if ([sessionInfo.invitedNotJoinedPaticipantIdArray containsObject:person.personId]) {
        [self addInfoLabelToCommandView:NSLocalizedString(@"Inviting ...", nil)];
        return;
    }
        
    NSMutableArray *viewArray = [NSMutableArray array];
    if (hasJoined) {
        [self addInfoLabelToCommandView:NSLocalizedString(@"Joined", nil)];
        if (![sessionInfo isCommentOwner] &&
            (![sessionInfo.CustomerId isEqualToString:sessionInfo.myId] ||
             (friendPerson &&  isFriend) ||
              isCoordinator)) {
            [_commandView constrainSubviewToLeft:_commandInfoLabel withMargin:0];
            return;
        }
        
    }
}

-(void) addRemoveButtonToCommandView {
    
    if (!_removeCommandButton) {
        _removeCommandButton = [[UIButton alloc] init];
        _removeCommandButton.translatesAutoresizingMaskIntoConstraints = NO;
        [_removeCommandButton setTitle:NSLocalizedString(@"Remove", nil) forState:UIControlStateNormal];
        [_removeCommandButton.titleLabel setFont:[UIFont htLight15Font]];
    }    
}

-(void) addMakeOwnerButtonToCommandView {
    
    if (!_makeOwnerCommandButton) {
        _makeOwnerCommandButton = [[UIButton alloc] init];
        [_makeOwnerCommandButton setTitle:NSLocalizedString(@"Make owner", @" ... of the question") forState:UIControlStateNormal];
    }
}

-(void) addCallNowButtonToCommandView:(BOOL)isCalling{
    
    if (!_callNowCommandButton) {
        _callNowCommandButton = [[UIButton alloc] init];
        if (isCalling) {
            [_callNowCommandButton setTitle:NSLocalizedString(@"Calling ...", nil) forState:UIControlStateNormal];
        }
        else {
            [_callNowCommandButton setTitle:NSLocalizedString(@"Call now", nil) forState:UIControlStateNormal];
        }
    }
}

@end
