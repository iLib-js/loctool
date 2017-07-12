package com.healthtap.userhtexpress.fragments.main;

import android.graphics.Color;
import android.os.Bundle;
import android.support.v4.view.MenuItemCompat;
import android.support.v7.widget.SearchView;
import android.text.SpannableStringBuilder;
import android.text.Spanned;
import android.text.TextUtils;
import android.text.method.LinkMovementMethod;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.widget.AbsListView;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.TextView;

import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.healthtap.userhtexpress.R;
import com.healthtap.userhtexpress.RB;
import com.healthtap.userhtexpress.adapters.askpicker.PickerResultAdapter;
import com.healthtap.userhtexpress.adapters.askpicker.PickerResultConcierge;
import com.healthtap.userhtexpress.adapters.askpicker.PickerResultFreeQuestion;
import com.healthtap.userhtexpress.adapters.askpicker.PickerResultPrime;
import com.healthtap.userhtexpress.adapters.askpicker.PickerResultWrapper;
import com.healthtap.userhtexpress.controllers.AccountController;
import com.healthtap.userhtexpress.customviews.RobotoRegularTextView;
import com.healthtap.userhtexpress.customviews.ShowMoreFooter;
import com.healthtap.userhtexpress.fragments.BaseFragment;
import com.healthtap.userhtexpress.fragments.concierge.ConciergeInviteFragment;
import com.healthtap.userhtexpress.model.local.DetailLocationModel;
import com.healthtap.userhtexpress.span.ClickableSpanWithoutUnderline;
import com.healthtap.userhtexpress.util.HTEventConstants;
import com.healthtap.userhtexpress.util.HTEventTrackerUtil;
import com.healthtap.userhtexpress.util.HealthTapApi;
import com.healthtap.userhtexpress.util.PrimeCheckHandler;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by wuhaoouyang on 10/31/16.
 */

public class AskPickerSearchFragment extends BaseFragment implements SearchView.OnQueryTextListener,
        AskPickerFiltersFragment.FilterCallback, AbsListView.OnItemClickListener {

    public static final String ARG_CONTEXT_ID = "context_id";

    private DetailLocationModel locationModel;
    private String questionText;
    private String searchText;
    private int page;
    private List<PickerResultWrapper> itemList = new ArrayList<>();
    private PickerResultAdapter mPickerAdapter;
    private ListView listView;
    private ShowMoreFooter showMore;

    private Bundle filters;

    public static AskPickerSearchFragment newInstance(String searchString) {
        AskPickerSearchFragment frag = new AskPickerSearchFragment();
        Bundle args =  new Bundle();
//        args.putString("search_string", searchString);
        frag.setArguments(args);
        return frag;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setHasOptionsMenu(true);
        filters = new Bundle();

        Bundle args = getArguments();
        if (args != null) {
            searchText = args.getString("search_string");
            if (args.containsKey(ARG_CONTEXT_ID)) {
                filters.putString(ARG_CONTEXT_ID, args.getString(ARG_CONTEXT_ID));
            }
        }
    }

    @Override
    public void onCreateOptionsMenu(Menu menu, MenuInflater inflater) {
        inflater.inflate(R.menu.menu_general_search, menu);

        MenuItem searchItem = menu.findItem(R.id.action_search);
        SearchView searchView = (SearchView) MenuItemCompat.getActionView(searchItem);
        if (searchView != null) {
            searchView.setMaxWidth((int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 1000f, getResources().getDisplayMetrics()));
            searchView.setQueryHint(getString(R.string.picker_search_hint));
            searchView.setOnQueryTextListener(this);
            if (!filters.containsKey(ARG_CONTEXT_ID)) {
                MenuItemCompat.expandActionView(searchItem);
                MenuItemCompat.setOnActionExpandListener(searchItem, new MenuItemCompat.OnActionExpandListener() {
                    @Override
                    public boolean onMenuItemActionExpand(MenuItem item) {
                        return true;
                    }

                    @Override
                    public boolean onMenuItemActionCollapse(MenuItem item) {
                        getBaseActivity().hideKeyboard();
                        getBaseActivity().onBackPressed();
                        return false;
                    }
                });
            }
            searchView.clearFocus();
            searchView.setQuery(searchText, false);
        }
        menu.findItem(R.id.action_filter).setVisible(false);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case R.id.action_filter:
                AskPickerFiltersFragment frag = new AskPickerFiltersFragment();
                frag.setFilterCallback(this);
                getBaseActivity().pushFragment(frag);
                return true;
        }
        return super.onOptionsItemSelected(item);
    }

    @Override
    public void onFiltersSaved(Bundle filters) {
        this.filters = filters;
    }

    @Override
    public boolean onQueryTextSubmit(String query) {
        page = 1;
        searchDoctors();
        return false;
    }

    @Override
    public boolean onQueryTextChange(String newText) {
        searchText = newText;
        return true;
    }

    @Override
    public void onViewCreated(View view, Bundle savedInstanceState) {
        HTEventTrackerUtil.logEvent(HTEventConstants.EventCategory.ASK_DOC.getCategory(), "doctor_view", "", "");
        getBaseActivity().getSupportActionBar().setTitle(R.string.picker_search_title);
        questionText = getArguments().getString(AskPickerFragment.ARG_QUESTION, "");
        locationModel = (DetailLocationModel) getArguments().getSerializable(AskPickerFragment.ARG_LOCATION);

        listView = (ListView) view.findViewById(R.id.doctors_list);
        mPickerAdapter = new PickerResultAdapter(itemList);
        if (AccountController.getInstance().getLoggedInUser().getEnterpriseGroupModel() != null) {
            TextView header = new RobotoRegularTextView(getActivity());
            header.setLayoutParams(new AbsListView.LayoutParams(AbsListView.LayoutParams.MATCH_PARENT, AbsListView.LayoutParams.WRAP_CONTENT));
            header.setGravity(Gravity.CENTER);
            int headerPadding = getResources().getDimensionPixelSize(R.dimen.margin_sixteen);
            header.setPadding(headerPadding, headerPadding, headerPadding, headerPadding);
            header.setBackgroundResource(R.color.light_green_background);
            header.setText(getString(R.string.picker_indicator_enterprise,
                    AccountController.getInstance().getLoggedInUser().getEnterpriseGroupModel().getName()));
            listView.addHeaderView(header);
        } else if (AccountController.getInstance().getLoggedInUser().isSubscribed ||
                AccountController.getInstance().getLoggedInUser().isPayAsYouGo) {
            TextView header = new RobotoRegularTextView(getActivity());
            header.setLayoutParams(new AbsListView.LayoutParams(AbsListView.LayoutParams.MATCH_PARENT, AbsListView.LayoutParams.WRAP_CONTENT));
            header.setGravity(Gravity.CENTER);
            int headerPadding = getResources().getDimensionPixelSize(R.dimen.margin_sixteen);
            header.setPadding(headerPadding, headerPadding, headerPadding, headerPadding);
            header.setBackgroundResource(R.color.light_green_background);
            header.setText(R.string.picker_indicator_prime);
            listView.addHeaderView(header);
        }
        showMore = new ShowMoreFooter(getActivity());
        View divider = new View(getActivity());
        divider.setLayoutParams(new AbsListView.LayoutParams(AbsListView.LayoutParams.MATCH_PARENT, getResources().getDimensionPixelSize(R.dimen.margin_one)));
        divider.setBackgroundColor(Color.TRANSPARENT);
        listView.addFooterView(divider);
        listView.addFooterView(showMore);
        TextView footerInvite = new RobotoRegularTextView(getActivity());
        footerInvite.setLayoutParams(new AbsListView.LayoutParams(AbsListView.LayoutParams.MATCH_PARENT, AbsListView.LayoutParams.WRAP_CONTENT));
        int padding = getResources().getDimensionPixelSize(R.dimen.margin_ten);
        footerInvite.setPadding(padding, padding, padding, padding);
        footerInvite.setGravity(Gravity.CENTER);
        footerInvite.setHighlightColor(Color.TRANSPARENT);
        footerInvite.setLinkTextColor(getResources().getColorStateList(R.color.selector_plain_text));
        SpannableStringBuilder ssb = new SpannableStringBuilder(
                AccountController.getInstance().getLoggedInUser().isAssociatedToProviderGroup() ?
                        RB.getString("Can't find a clinician? ") : RB.getString("Can't find a doctor? "));
        int start = ssb.length();
        String cta = RB.getString("Invite them to HealthTap");
        ssb.append(cta);
        ssb.setSpan(new ClickableSpanWithoutUnderline() {
            @Override
            public void onClick(View widget) {
                HTEventTrackerUtil.logEvent(HTEventConstants.EventCategory.ASK_DOC.getCategory(), "doctor_invite", "", "");
                getBaseActivity().pushFragment(new ConciergeInviteFragment());
            }
        }, start, start + cta.length(), Spanned.SPAN_INCLUSIVE_EXCLUSIVE);
        footerInvite.setText(ssb);
        footerInvite.setMovementMethod(LinkMovementMethod.getInstance());
        listView.addFooterView(footerInvite);
        listView.setAdapter(mPickerAdapter);
        listView.setOnItemClickListener(this);

        page = 1;
        searchDoctors();
    }

    @Override
    public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
        int headers = listView.getHeaderViewsCount();
        if (position < headers) {

        } else if (position < mPickerAdapter.getCount() + headers) {
            PickerResultWrapper item = mPickerAdapter.getItem(position - headers);
            if (item instanceof PickerResultConcierge) {
                if (!"out_of_service".equals(((PickerResultConcierge) item).getAvailabilityType())) {
                    HTEventTrackerUtil.logEvent(HTEventConstants.EventCategory.ASK_DOC.getCategory(), "doctor_continue",
                            "", ((PickerResultConcierge) item).getExpertId() + "");
                    AskPickerServiceFragment frag =
                            AskPickerServiceFragment.newInstance(((PickerResultConcierge) item).getExpertId());
                    frag.getArguments().putAll(getArguments());
                    getBaseActivity().pushFragment(frag);
                }
            } else if (item instanceof PickerResultPrime) {
                if (((PickerResultPrime) item).isServiceAvailable()) {
                    HTEventTrackerUtil.logEvent(HTEventConstants.EventCategory.ASK_DOC.getCategory(), "doctor_continue", "", "prime");
                    new PrimeCheckHandler(getActivity(), questionText).tryGoComposeConsult(locationModel);
                }
            } else if (item instanceof PickerResultFreeQuestion) {
                HTEventTrackerUtil.logEvent(HTEventConstants.EventCategory.ASK_DOC.getCategory(), "doctor_continue", "", "free_question");
                getBaseActivity().pushFragment(AskQuestionToDocFragment.newInstance(questionText));
            }
        } else {
            if (view == showMore && !showMore.isShowProgress()) {
                page += 1;
                searchDoctors();
            }
        }
    }

    private void searchDoctors() {
        Map<String, String> params = new HashMap<>();
        // TODO add search string
        if (TextUtils.isEmpty(searchText)) {
            params.put("initial_query", "true");
            params.put("search_string", questionText);
        } else {
            params.put("initial_query", "false");
            params.put("search_string", searchText);
        }
        if (locationModel != null) {
            params.put("latitude", Double.toString(locationModel.latitude));
            params.put("longitude", Double.toString(locationModel.longitude));
        }
        if (filters != null) {
            for (String key : filters.keySet()) {
                Object value = filters.get(key);
                if (value instanceof String) {
                    params.put(key, (String) value);
                }
            }
        }
        showMore.setShowProgress(true);
        HealthTapApi.getAskDocSuggestedDocs(page, params, new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                JSONArray content = response.optJSONArray("content");
                if (page == 1) {
                    itemList.clear();
                }
                for (int i = 0; i < content.length(); i++) {
                    try {
                        JSONObject item = content.getJSONObject(i);
                        String type = item.getString("type");
                        if ("OnCallServiceCard".equals(type)) {
                            itemList.add(new PickerResultPrime(item));
                        } else if ("AskFreeQuestion".equals(type)) {
                            itemList.add(new PickerResultFreeQuestion(item));
                        } else if ("ConciergeServiceCard".equals(type)) {
                            itemList.add(new PickerResultConcierge(item));
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
                mPickerAdapter.notifyDataSetChanged();
                showMore.setShowProgress(false);
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                showMore.setShowProgress(false);
            }
        });
    }

    @Override
    protected boolean loadContent() {
        return false;
    }

    @Override
    protected int getLayoutId() {
        return R.layout.fragment_picker_search;
    }
}