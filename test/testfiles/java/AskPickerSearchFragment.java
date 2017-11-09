package com.myproduct.fragments.main;

import android.graphics.Color;
import android.os.Bundle;

public class AskPickerSearchFragment extends BaseFragment implements SearchView.OnQueryTextListener,
        AskPickerFiltersFragment.FilterCallback, AbsListView.OnItemClickListener {
    @Override
    public void onViewCreated(View view, Bundle savedInstanceState) {
        getBaseActivity().getSupportActionBar().setTitle(R.string.picker_search_title);
        questionText = getArguments().getString(AskPickerFragment.ARG_QUESTION, "");

        showMore = new ShowMoreFooter(getActivity());
        View divider = new View(getActivity());
        divider.setLayoutParams(new AbsListView.LayoutParams(AbsListView.LayoutParams.MATCH_PARENT, getResources().getDimensionPixelSize(R.dimen.margin_one)));
        footerInvite.setLinkTextColor(getResources().getColorStateList(R.color.selector_plain_text));
        SpannableStringBuilder ssb = new SpannableStringBuilder(
                AccountController.getInstance().getLoggedInUser().isAssociatedToGroup() ?
                        RB.getString("Can't find a group? ") : RB.getString("Can't find a friend? "));
        int start = ssb.length();
        String cta = RB.getString("Invite them to Myproduct");
        ssb.append(cta);
        footerInvite.setText(ssb);
    }
}
