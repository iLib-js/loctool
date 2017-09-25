//
//  MPParticipantTableCellView.m
//  LiveChat
//

#import "MPParticipantTableCellView.h"
#import "UIColor+MPColor.h"
#import "UIFont+MPFont.h"
#import "UIView+MPConstraints.h"
#import "UIView+ImageNamed.h"
#import "FGConstants.h"
#import "MPExpertObject.h"
#import "UIColor+MPColor.h"
#import "MPHorizontalHairlineView.h"
#import "MPSessionInfo.h"
#import "FGPrimaryButton.h"
//@import AFNetworking;
#import "FGAccountInfo.h"

#define kPersonInfoXStart             90.0
#define kRoundCornderRadius           8.0

#define kRemoveButtonWidth            60
#define kButtonGap                    15
#define kMakeOwnerButtonWidth         100
#define kCallNowButtonWidth           60

@interface MPParticipantTableCellView ()

@property (strong, nonatomic) UIImageView* availableImageView;
@property (strong, nonatomic) UIImageView* avatarImageView;
@property (strong, nonatomic) UILabel* nameLabel;
@property (strong, nonatomic) UILabel* specialtyLabel;
@property (strong, nonatomic) UILabel* locationLabel;

@property (nonatomic, strong) UIImageView *caduceusImageView;

@property (nonatomic, strong) UIView* commandView;

// keep the same life cycle as command view
@property (nonatomic, strong) UIButton* makeOwnerCommandButton;
@property (nonatomic, strong) UIButton* removeCommandButton;
@property (nonatomic, strong) UIButton* callNowCommandButton;
@property (nonatomic, strong) UILabel* commandInfoLabel;
@property (nonatomic, strong) NSLayoutConstraint* commandViewHeightConstraint;

// control round corners on top or bottom
@property (strong, nonatomic) UIView *backgroundView;
@property (strong, nonatomic) NSLayoutConstraint *backgroundViewTopConstraint;
@property (strong, nonatomic) NSLayoutConstraint *backgroundViewBottomConstraint;

@property (nonatomic, strong) MPHorizontalHairlineView *rowViewBottomLine;

@property (nonatomic, strong) UIView* infoView;
//@property (nonatomic, strong) NSLayoutConstraint* finfoViewWidthConstraint;

@end

@implementation MPParticipantTableCellView

+(CGFloat) heightWithPersonObject:(MPPersonObject *)personObject withSessionInfo:(MPSessionInfo *)sessionInfo andViewWidth:(CGFloat)viewWidth {
    
    static MPParticipantTableCellView *protoView = nil;
    if (!protoView) {
        protoView = [[MPParticipantTableCellView alloc] init];
    }
    
    [protoView updateWithPersonObject:personObject withSessionInfo:sessionInfo andViewWidth:viewWidth];
    [protoView setNeedsLayout];
    [protoView layoutIfNeeded];
    CGSize size = [protoView systemLayoutSizeFittingSize:UILayoutFittingCompressedSize];
    return size.height;
}

-(void) updateWithPersonObject:(MPPersonObject *)object withSessionInfo:(MPSessionInfo *)sessionInfo andViewWidth:(CGFloat)viewWidth {
    
    self.personObject = object;
    self.viewWidthConstraint.constant = viewWidth;
    
    self.backgroundViewBottomConstraint.constant = self.shouldShowRoundBottom ? 0:kRoundCornderRadius;
    self.backgroundViewTopConstraint.constant = self.shouldShowRoundTop ? 0: -kRoundCornderRadius;
    
    self.nameLabel.text = [object getFullName];
    if ([object.avataImageUrl isKindOfClass:NSString.class]) {
        [self.avatarImageView setImageWithURL:[NSURL URLWithString:object.avataImageUrl] placeholderImage:nil];
    }
    
    self.availableImageView.hidden = YES;
    [self.locationLabel setText:[self.personObject getCityState]];
    if ([object isKindOfClass:MPExpertObject.class]) {
        MPExpertObject* experttor = (MPExpertObject *)object;
        self.specialtyLabel.text = expert.specialty;
        self.caduceusImageView.hidden = !expert.isexpert;
        
        self.availableImageView.hidden =  ![expert.available isEqualToString:@"available"];
        
        // experts in active participant array are not available
        if ([sessionInfo.activePaticipantIdArray containsObject:object.personId]){
            self.availableImageView.hidden = YES;
        }
        
        if (sessionInfo.coordinatorId  && [sessionInfo.coordinatorId isEqualToString:object.personId]) {
            self.specialtyLabel.text = NSLocalizedString(@"Staff", nil);
        }
    }
    else {
        
        self.caduceusImageView.hidden = YES;
        
        //TODO:
        if ([sessionInfo.CustomerId isEqualToString:object.personId]) {
            self.specialtyLabel.text = NSLocalizedString(@"Customer", nil);
            self.locationLabel.text = [object getCityState];
            
            if (self.locationLabel.text.length == 0) {
                // prevent bad layout
               // self.locationLabel.text = @" ";
            }
        }
        else if (sessionInfo.coordinatorId  && [sessionInfo.coordinatorId isEqualToString:object.personId]) {
            
            self.specialtyLabel.text = NSLocalizedString(@"Staff", nil);
            self.locationLabel.text = [object getCityState];
            
            if (self.specialtyLabel.text.length == 0 && self.locationLabel.text.length == 0) {
                // prevent bad layout
                //self.specialtyLabel.text = @" ";
            }
        }
        else {
            self.specialtyLabel.text = [object getCityState];
            if (self.specialtyLabel.text.length == 0 && self.locationLabel.text.length == 0) {
                // prevent bad layout
                //self.specialtyLabel.text = @" ";
            }
            
            //self.locationLabel.text = @" ";
        }
    }
    
    [self updateCommandViewWithPersonObject:object andSessionInfo:sessionInfo];
    self.rowViewBottomLine.hidden = self.shouldShowRoundBottom;

}

-(id) init {
    
    if (self = [super init]){
        [self setup];
    }
    
    return self;
}

// estimated view width, real view width will be passed in
-(CGFloat) getViewWidth {
    return IS_IPAD ? (SCREEN_WIDTH/2 - 20): SCREEN_WIDTH - 20;
}

-(void) setup {
    
    [self setTranslatesAutoresizingMaskIntoConstraints:NO];
    self.backgroundColor = [UIColor htVeryLightGrayBackgroundColor];
    
    self.viewWidthConstraint = [self constrainToWidth:[self getViewWidth]];
    [self initializeBackgroundView];
    
    _infoView = [[UIView alloc] init];
    _infoView.translatesAutoresizingMaskIntoConstraints = NO;
    [self addSubview:_infoView];
    [self constrainSubviewToLeft:_infoView withMargin:kPersonInfoXStart];
    [self constrainSubviewToTop:_infoView withMargin:10];
    [self constrainSubviewToBottom:_infoView withMargin:0];
    [self constrainSubviewToRight:_infoView withMargin:-10];

    [self initializeAvatarImageView];
    [self initializeAvailableImage];
    [self initializeCaduceusImageView];
    
    [self initializeNameLabel];
    [self initializeSpecialtyLabel];
    [self initializeLocationLabel];

    [self intializeCommandView];
    
    NSArray* subviewArray = [NSArray arrayWithObjects:self.nameLabel,self.specialtyLabel,self.locationLabel, self.commandView, nil];
    NSArray* paddingArray = [NSArray arrayWithObjects:@0,@3,@3,@0, nil];
    [self.infoView constrainColumnVerticalPositioning:subviewArray withTopPaddingArray:paddingArray];
    
    self.clipsToBounds = YES;
    self.rowViewBottomLine = [[MPHorizontalHairlineView alloc] init];
    [self addSubview:self.rowViewBottomLine];
    [self constrainSubviewToLeftAndRightEdges:self.rowViewBottomLine withMargin:0];
    [self constrainSubviewToBottom:self.rowViewBottomLine withMargin:0];
}

-(void) intializeCommandView {
    
    _commandView = [[UIView alloc] init];
    _commandView.translatesAutoresizingMaskIntoConstraints = NO;
 
    [_infoView addSubview:_commandView];
    self.commandViewHeightConstraint = [_commandView constrainToHeight:40];
    [_infoView constrainSubviewToLeftAndRightEdges:_commandView withMargin:0];
    [_infoView constrainSubviewToBottom:_commandView withMargin:0];
}

-(void) updateCommandViewWithPersonObject:(MPPersonObject *)person andSessionInfo:(MPSessionInfo *)sessionInfo {
    
    BOOL amPrimaryMember    = [sessionInfo.CustomerId isEqualToString:sessionInfo.myId];
    
    BOOL amSecondaryMember = !amPrimaryMember;
    
    
    MPExpertObject * expertPerson = nil;
    
    if ([person isKindOfClass:MPExpertObject.class] ) {
        expertPerson = (MPExpertObject*) person;
    }

    
    BOOL isExpert = person.isExpert;
    
    
    if (sessionInfo.isQuestionEnded || sessionInfo.isMessageQuestion) {
        self.commandViewHeightConstraint.constant = 10;
        return;
    }
    
    self.commandViewHeightConstraint.constant = 40;
    NSArray* array = _commandView.subviews;
    for (UIView* view in array){
        [view removeFromSuperview];
    }
    
    BOOL isOwner = [sessionInfo.soapOwnerId isEqualToString:person.personId];
    if ([sessionInfo.leftPaticipantIdArray containsObject:person.personId] ||
        [sessionInfo.removedParticipantIdArray containsObject:person.personId]) {
        [self addInfoLabelToCommandView:NSLocalizedString(@"Left question", nil)];
        [_commandView constrainSubviewToLeft:_commandInfoLabel withMargin:0];
        return;
    }
    
    BOOL isCoordinator = [sessionInfo.coordinatorId isEqualToString:person.personId];
    if ([sessionInfo isCoordinator] && [sessionInfo.requestedExpertId isEqualToString:person.personId] &&
        ![sessionInfo.activePaticipantIdArray containsObject:person.personId]) {
        BOOL isCalling = [sessionInfo.invitedNotJoinedPaticipantIdArray containsObject:person.personId];
        [self addCallNowButtonToCommandView:isCalling];
        
        return;
    }
    
    if (isOwner) {
        [self addInfoLabelToCommandView:NSLocalizedString(@"Owner", @"Owner of the question")];
        [_commandView constrainSubviewToLeft:_commandInfoLabel withMargin:0];
        return;
    }
    
    if ([sessionInfo.invitedNotJoinedPaticipantIdArray containsObject:person.personId]) {
        [self addInfoLabelToCommandView:NSLocalizedString(@"Inviting ...", nil)];
        [_commandView constrainSubviewToLeft:_commandInfoLabel withMargin:0];
        return;
    }
    
    BOOL hasJoined = [sessionInfo.activePaticipantIdArray containsObject:person.personId];
    
    // not owner, can not remove or make other expert as owner
    if (![sessionInfo isSoapOwner] && !hasJoined) {
        self.commandViewHeightConstraint.constant = 10;
        return;
    }
    
    NSMutableArray *viewArray = [NSMutableArray array];
    if (hasJoined) {
        [self addInfoLabelToCommandView:NSLocalizedString(@"Joined", nil)];
        if (![sessionInfo isSoapOwner] &&
            (![sessionInfo.CustomerId isEqualToString:sessionInfo.myId] ||
             (expertPerson &&  isExpert) ||
              isCoordinator)) {
            [_commandView constrainSubviewToLeft:_commandInfoLabel withMargin:0];
            return;
        }
        
        [viewArray addObject:_commandInfoLabel];
    }
    
    if (amSecondaryMember)
        return;
    
    // Am primary Customer ... I can remove other (secondary) members
    
    if (!isExpert && !isCoordinator && ![person.personId isEqualToString:sessionInfo.myId]) {
        [self addRemoveButtonToCommandView];
        [viewArray addObject:_removeCommandButton];
    }
    
    /*  disable "make owner " for customer side
    if ([person isKindOfClass:MPExpertObject.class] && !isCoordinator && hasJoined){
        [self addMakeOwnerButtonToCommandView];
        [viewArray addObject:_makeOwnerCommandButton];
    }
    */
    if (viewArray.count == 0) {
        self.commandViewHeightConstraint.constant = 10;
    } else if (viewArray.count == 1) {
        [_commandView constrainSubviewToLeft:viewArray[0] withMargin:0];
    }
    else if (viewArray.count == 2) {
        [_commandView constrainRowHorizontalPositioning:viewArray withLeftPaddingArray:@[@0,@20]];
    }
    else if (viewArray.count == 3){
        [_commandView constrainRowHorizontalPositioning:viewArray withLeftPaddingArray:@[@0,@20,@20]];
    }
}


#pragma mark -- helper methods for command view
-(void) addInfoLabelToCommandView:(NSString *)text {
    
    if (!_commandInfoLabel) {
        _commandInfoLabel = [[UILabel alloc] init];
        _commandInfoLabel.translatesAutoresizingMaskIntoConstraints = NO;
        [_commandInfoLabel setTextColor:[UIColor htDarkGrayTextColor]];
        [_commandInfoLabel setFont:[UIFont htLight15Font]];
    }
    
    [_commandView addSubview:_commandInfoLabel];
    [_commandView verticallyConstrainViewsToCenter:@[_commandInfoLabel]];
    [_commandView constrainSubviewToLeft:_commandInfoLabel withMargin:0];
    _commandInfoLabel.text = text;
}

-(void) removeButtonTapped:(id)sender {
    [self.delegate participantTableCellView:self removePerson:self.personObject];
}

-(void) makeOwnerButtonTapped:(id)sender {
    [self.delegate participantTableCellView:self makePersonOwner:self.personObject];
}

-(void) callNowButtonTapped:(id)sender {
    [self.delegate participantTableCellView:self invitePerson:self.personObject];
}

-(void) addRemoveButtonToCommandView {
    
    if (!_removeCommandButton) {
        _removeCommandButton = [[UIButton alloc] init];
        _removeCommandButton.translatesAutoresizingMaskIntoConstraints = NO;
        [_removeCommandButton setTitleColor:[UIColor htGreenTextColor] forState:UIControlStateNormal];
        [_removeCommandButton setTitle:NSLocalizedString(@"Remove", nil) forState:UIControlStateNormal];
        [_removeCommandButton.titleLabel setFont:[UIFont htLight15Font]];
        [_removeCommandButton constrainToWidth:kRemoveButtonWidth];
        _removeCommandButton.contentHorizontalAlignment = UIControlContentHorizontalAlignmentLeft;
        
        [_removeCommandButton addTarget:self action:@selector(removeButtonTapped:) forControlEvents:UIControlEventTouchUpInside];
    }
    
    [_commandView addSubview:_removeCommandButton];
    [_commandView constrainSubviewToTopAndBottomEdges:_removeCommandButton withMargin:0];
    [_commandView verticallyConstrainViewsToCenter:@[_removeCommandButton]];
    [_commandView constrainSubviewToLeft:_removeCommandButton withMargin:0];
    
}

-(void) addMakeOwnerButtonToCommandView {
    
    if (!_makeOwnerCommandButton) {
        _makeOwnerCommandButton = [[UIButton alloc] init];
        _makeOwnerCommandButton.translatesAutoresizingMaskIntoConstraints = NO;
        [_makeOwnerCommandButton setTitleColor:[UIColor htGreenTextColor] forState:UIControlStateNormal];
        [_makeOwnerCommandButton setTitle:NSLocalizedString(@"Make owner", @" ... of the question") forState:UIControlStateNormal];
        [_makeOwnerCommandButton.titleLabel setFont:[UIFont htLight15Font]];
        [_makeOwnerCommandButton constrainToWidth:kMakeOwnerButtonWidth];
        _makeOwnerCommandButton.contentHorizontalAlignment = UIControlContentHorizontalAlignmentLeft;
        
        [_makeOwnerCommandButton addTarget:self action:@selector(makeOwnerButtonTapped:) forControlEvents:UIControlEventTouchUpInside];
    }
    
    [_commandView addSubview:_makeOwnerCommandButton];
    [_commandView constrainSubviewToTopAndBottomEdges:_makeOwnerCommandButton withMargin:0];
    [_commandView verticallyConstrainViewsToCenter:@[_makeOwnerCommandButton]];
}

-(void) addCallNowButtonToCommandView:(BOOL)isCalling{
    
    if (!_callNowCommandButton) {
        _callNowCommandButton = [[UIButton alloc] init];
        _callNowCommandButton.translatesAutoresizingMaskIntoConstraints = NO;
        [_callNowCommandButton setTitleColor:[UIColor htGreenTextColor] forState:UIControlStateNormal];
        if (isCalling) {
            [_callNowCommandButton setTitle:NSLocalizedString(@"Calling ...", nil) forState:UIControlStateNormal];
        }
        else {
            [_callNowCommandButton setTitle:NSLocalizedString(@"Call now", nil) forState:UIControlStateNormal];
        }
        
        [_callNowCommandButton.titleLabel setFont:[UIFont htLight15Font]];
        [_callNowCommandButton constrainToWidth:kCallNowButtonWidth];
        _callNowCommandButton.contentHorizontalAlignment = UIControlContentHorizontalAlignmentLeft;
        
        if (!isCalling) {
            [_callNowCommandButton addTarget:self action:@selector(callNowButtonTapped:) forControlEvents:UIControlEventTouchUpInside];
        }
    }
    
    [_commandView addSubview:_callNowCommandButton];
    [_commandView constrainSubviewToTopAndBottomEdges:_callNowCommandButton withMargin:0];
    [_commandView verticallyConstrainViewsToCenter:@[_callNowCommandButton]];
    [_commandView constrainSubviewToLeft:_callNowCommandButton withMargin:0];
}


-(void)initializeBackgroundView
{
    self.backgroundView = [[UIView alloc] init];
    [self.backgroundView setTranslatesAutoresizingMaskIntoConstraints:NO];
    self.backgroundView.backgroundColor = [UIColor whiteColor];
    
    [self addSubview:self.backgroundView];
    self.backgroundView.layer.cornerRadius = kRoundCornderRadius;
    self.backgroundView.layer.masksToBounds = YES;
    [self constrainSubviewToLeftAndRightEdges:self.backgroundView withMargin:1];
    self.backgroundView.layer.borderWidth = 1.;
    self.backgroundView.layer.borderColor = [UIColor htLightGrayBorderColor].CGColor;
    
    self.backgroundViewTopConstraint = [self constrainSubviewToTop:self.backgroundView withMargin:-kRoundCornderRadius];
    self.backgroundViewBottomConstraint = [self constrainSubviewToBottom:self.backgroundView withMargin:kRoundCornderRadius];
}

- (void)initializeAvatarImageView
{
    _avatarImageView = [[UIImageView alloc] init];
    [self addSubview:_avatarImageView];
    [_avatarImageView setTranslatesAutoresizingMaskIntoConstraints:NO];
    [_avatarImageView constrainViewToSize:CGSizeMake(55, 55)];
    [_avatarImageView setContentMode:UIViewContentModeScaleAspectFit];
    [self constrainSubview:_avatarImageView toOrigin:CGPointMake(15, 10)];
}

- (void)initializeNameLabel
{
    _nameLabel = [[UILabel alloc] init];
    [_nameLabel setTranslatesAutoresizingMaskIntoConstraints:NO];
    [self.infoView addSubview:_nameLabel];
    [_nameLabel setFont:[UIFont htRegular16Font]];
    [_nameLabel setTextColor:[UIColor htDarkGrayTextColor]];
    _nameLabel.numberOfLines = 0;
    _nameLabel.lineBreakMode = NSLineBreakByWordWrapping;
    
    [self.infoView constrainSubviewToLeftAndRightEdges:_nameLabel withMargin:0];
}

- (void)initializeSpecialtyLabel {
    
    _specialtyLabel = [[UILabel alloc] init];
    [_specialtyLabel setTranslatesAutoresizingMaskIntoConstraints:NO];
    [self.infoView addSubview:_specialtyLabel];
    [_specialtyLabel setFont:[UIFont htLight14Font]];
    _specialtyLabel.numberOfLines = 0;
    _specialtyLabel.lineBreakMode = NSLineBreakByWordWrapping;
    [_specialtyLabel setTextColor:[UIColor htGrayTextColor]];
    
    [self.infoView constrainSubviewToLeftAndRightEdges:_specialtyLabel withMargin:0];
}

- (void)initializeAvailableImage{
    
    self.availableImageView = [[UIImageView alloc] init];
    [self.availableImageView setTranslatesAutoresizingMaskIntoConstraints:NO];
    [self.availableImageView setImage:[self imageNamed:@"available_dot"]];
    [self addSubview:self.availableImageView];
    [self.availableImageView constrainViewToSize:CGSizeMake(11, 11)];
    [self.availableImageView setContentMode:UIViewContentModeScaleAspectFit];
    [self constrainSubview:self.availableImageView toOrigin:CGPointMake(10, 10)];
}

- (void)initializeCaduceusImageView
{
    _caduceusImageView = [[UIImageView alloc] init];
    [self.caduceusImageView setTranslatesAutoresizingMaskIntoConstraints:NO];
    [self.caduceusImageView setImage:[self imageNamed:@"expert_caduceus_red"]];
    [self addSubview:self.caduceusImageView];
    [self.caduceusImageView constrainViewToSize:CGSizeMake(9, 15)];
    [self.caduceusImageView setContentMode:UIViewContentModeScaleAspectFit];
    [self constrainSubview:self.caduceusImageView toOrigin:CGPointMake(76, 13)];
}

- (void)initializeLocationLabel{
    
    _locationLabel = [[UILabel alloc] init];
    [_locationLabel setTranslatesAutoresizingMaskIntoConstraints:NO];
    [self.infoView addSubview:_locationLabel];
    [_locationLabel setTextColor:[UIColor htGrayTextColor]];
    [_locationLabel setFont:[UIFont htLight14Font]];
    _locationLabel.numberOfLines = 0;
    _locationLabel.lineBreakMode = NSLineBreakByWordWrapping;
  
    [self.infoView constrainSubviewToLeftAndRightEdges:_locationLabel withMargin:0];
}

@end
