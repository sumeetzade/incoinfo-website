"""Generate the FAQ partials from one question list.
  python scripts/gen-faq.py            -> partials/faq.html (tabbed, home + pricing)
                                          partials/faq-all.html (full /faq/ page, with FAQPage JSON-LD)
Answers marked confirm=True get a TODO comment (business fact to confirm)."""
import html, json, re, sys

NL = chr(10)
OUT = 'partials/faq.html'
OUT_ALL = 'partials/faq-all.html'

L_STD = '<a class="link" href="/data-standards/">Read about our data sources and standards</a>.'
L_SAMPLES = '<a class="link" href="/database/#samples">Content</a>'
L_REFUND = '<a class="link" href="/legal/refunds/">refund policy</a>'
L_PRIVACY = '<a class="link" href="/legal/privacy/">privacy policy</a>'
L_TERMS = '<a class="link" href="/legal/terms/">terms of service</a>'
L_SALES = '<a class="link" href="/company/#contact">talk to sales</a>'
L_SUPPORT = '<a class="link" href="mailto:support@incoinfo.com">support@incoinfo.com</a>'

G = [
 ('data', 'Data and Coverage', [
  ('Where does the data come from?', f'From official company registries and filings in each country we cover. For India, our current coverage, that means filings with the Ministry of Corporate Affairs and Registrar of Companies, statutory charge records and GST registration data.', False),
  ('Which companies can I find?', 'Companies and LLPs registered in India, including active, struck-off and under-liquidation entities. More countries are planned.', True),
  ('How current is the data?', 'We refresh company data twice a year, in January to March and July to September. Your report shows the data from the most recent refresh, and if a refresh happens during your 12 months of access, you get the updated data automatically. Companies usually file the previous year’s financial statements in time for the January to March refresh.', False),
  ('What if a company has not filed recent data?', 'Reports reflect the latest filings on record. If a company has delayed its statutory filings, your report contains the complete verified data up to its most recent filing. If it files later, the new data is added at the next scheduled refresh, at no extra cost while your 12 months of access last. If a company is newly incorporated and has not completed its first annual filing, your used credit for that company will be reversed.', False),
  ('Do you cover listed companies as well as private ones?', 'Yes. Listed and unlisted companies both file with the company registry, so both are covered in the same report format.', True),
  ('How accurate is the data?', 'Figures are taken from the documents the company filed and standardised into one format. We do not change filed figures, so if a filing contains an error, the report shows it as filed.', False),
  ('Can I request a company I can’t find?', f'Yes. Write to {L_SUPPORT} with the company name or registration number and we will check whether it can be added.', True),
 ]),
 ('reports', 'Reports and Delivery', [
  ('What do I get when I unlock a company?', '12 months of access to the company’s compiled data: multi-year financial statements, directors and shareholding, registered charges, compliance status and related companies. You can download the statutory filings based on your package, and you get refreshed data whenever a scheduled refresh happens during those 12 months.', False),
  ('How fast are orders processed?', 'Our delivery norms depend on the compilation level in your plan: Standard (Professional) is up to 25 companies a week per client, Expedited (Business and Corporate) is up to 50 companies a week per client, and Priority (Enterprise) is up to 100 companies a week per client. Depending on workload, our standard terms allow these norms to vary. Our delivery team will confirm the timeline when we receive your order.', False),
  ('Can I see a sample before buying?', f'Yes. Sample reports are on the {L_SAMPLES} page, and the demo shows the full workflow from search to report.', False),
  ('Which formats can I download?', 'PDF for reading and sharing, and Excel for analysis. Every report uses the same fields and layout, so companies are easy to compare. You can also download the original filings the report is built from.', False),
  ('How many years of financials are included?', 'Up to five years, where the company has filed them.', True),
  ('How do the 12 months of updates work?', 'We refresh data on a fixed schedule twice a year: January to March and July to September. Every client with an active 12-month access period for a company gets the refreshed data automatically. A refresh picks up new financial statements, annual returns, changes in directors and shareholding, new or satisfied charges, and compliance status. Data is not updated between scheduled refreshes. If you need a company updated sooner, you can buy a credit for it again.', False),
  ('Can I re-download a report?', 'Yes, as often as you like during your 12 months of access, without spending another credit.', False),
 ]),
 ('plans', 'Plans and Credits', [
  ('How do credits work?', 'One credit gives you 12 months of access to one company’s data, including any scheduled refreshes in that period.', False),
  ('Which plan should I choose?', 'Professional is a single-user plan for individual consultants and analysts. Business, Corporate and Enterprise give 2, 5 and 10 users one account. The calculator on this page shows the lowest cost for the number of companies you need.', False),
  ('Can I buy a single company without a plan?', 'Yes. A single company costs ₹599 plus taxes.', False),
  ('Do credits expire?', 'Credits are valid for 12 months from the date of purchase. Once a company is unlocked, you have access to its data for 12 months. When you renew, you choose which companies to keep, and only those stay accessible.', False),
  ('Is there a subscription or auto-renewal?', 'No. You buy credits when you need them, and nothing renews or charges automatically.', False),
  ('Can I top up or upgrade later?', 'Yes. Buy another plan at any time and the credits are added to your balance. Each purchase keeps its own 12-month validity.', True),
  ('Does opening the same company again cost another credit?', 'No. During your 12 months of access you can open and download the company as often as you like. A new credit is needed only to extend access beyond 12 months, or to get the company updated before the next scheduled refresh.', False),
  ('Do you offer custom pricing for larger volumes?', f'Yes. If you need more than 1,000 companies a year, {L_SALES}.', False),
 ]),
 ('billing', 'Billing and Payments', [
  ('Which payment methods do you accept?', 'Credit and debit cards, UPI and net banking, processed by our payment partner.', True),
  ('Are prices inclusive of GST?', 'No. Prices exclude taxes, and GST is added at checkout.', False),
  ('Will I get a GST invoice?', 'Yes. A tax invoice with your company’s GSTIN is available to download from your account.', True),
  ('Can we pay by bank transfer or purchase order?', f'Yes, for Corporate and Enterprise plans. Please {L_SALES} to arrange it.', True),
  ('Can I get a refund on unused credits?', f'Unused credits can be refunded within 7 days of purchase if none have been used. See the {L_REFUND} for details.', True),
  ('Is payment secure?', 'Payments are handled by a PCI-DSS compliant payment partner. We do not see or store your card details.', True),
 ]),
 ('accounts', 'Accounts and Users', [
  ('Do I need an account to search?', 'Yes. You need an account (a login) to search the company database. You can buy a plan whenever you are ready to unlock companies.', False),
  ('How many users are included?', 'Professional is for a single user. Business includes 2 users, Corporate 5 users and Enterprise 10 users, all on one account.', False),
  ('Can team members share credits?', 'Yes. On team plans, all users draw from one shared credit balance.', True),
  ('Can I add or remove users later?', 'Yes. The account administrator can add or remove users at any time.', True),
  ('Can I try it before buying?', 'Yes. Open the demo to see search, ordering and a full company report.', False),
 ]),
 ('support', 'Support and Legal', [
  ('How do I contact support?', f'Email {L_SUPPORT}. We reply Monday to Friday, 9:00 AM to 6:00 PM IST.', False),
  ('Is my search activity private?', 'Yes. We do not share which companies you search for or unlock, and companies are not told that you looked them up.', False),
  ('How do you handle personal data about directors?', f'We show only the information that appears in public statutory filings. See our {L_PRIVACY}.', False),
  ('Can I share a report outside my organisation?', f'You are buying 12 months of access to the data for use within your organisation, not the data itself. Please do not resell or republish reports. See the {L_TERMS}.', True),
  ('Is a report investment or legal advice?', 'No. Reports present information from public and official filings for reference and due diligence. Verify material facts independently and take professional advice before making decisions.', False),
 ]),
]

ICON = {'data': 'database', 'reports': 'file-text', 'plans': 'layers', 'billing': 'receipt', 'accounts': 'users', 'support': 'life-buoy'}
HEAD = {'data': 'Data and coverage', 'reports': 'Reports and delivery', 'plans': 'Plans and credits', 'billing': 'Billing and payments', 'accounts': 'Accounts and users', 'support': 'Support and legal'}

def plain(s):
    return html.unescape(re.sub(r'<[^>]+>', '', s))

out = []
out.append('<!-- Grouped FAQ (6 categories). Generated from the approved question list.\n     Answers with "TODO: confirm" state a business fact still to be confirmed.\n     Include with: start="data|reports|plans|billing|accounts|support" (tab shown first). -->')
out.append('<div class="faq-wrap" data-tabs data-start="{{start}}">')
out.append('  <div class="faq-tabs" role="tablist" aria-label="Question categories">')
for i, (key, label, _) in enumerate(G):
    sel = 'true' if i == 0 else 'false'
    tab = '0' if i == 0 else '-1'
    out.append(f'    <button class="faq-tab" type="button" role="tab" id="faqt-{key}" data-key="{key}" aria-controls="faqp-{key}" aria-selected="{sel}" tabindex="{tab}">{html.escape(label)}</button>')
out.append('  </div>')
for i, (key, label, qs) in enumerate(G):
    hidden = '' if i == 0 else ' hidden'
    out.append(f'  <div class="faq" id="faqp-{key}" role="tabpanel" aria-labelledby="faqt-{key}" tabindex="0" data-accordion{hidden}>')
    for n, (q, a, confirm) in enumerate(qs, 1):
        qid = f'faq-{key}-{n}'
        out.append('    <div class="acc-item">')
        out.append(f'      <h3><button class="acc-trigger" type="button" aria-expanded="false" aria-controls="{qid}" id="{qid}-btn">{html.escape(q, quote=False)} {{{{icon:plus|acc-icon}}}}</button></h3>')
        if confirm:
            out.append('      <!-- TODO: confirm this answer with the business -->')
        out.append(f'      <div class="acc-panel" id="{qid}" role="region" aria-labelledby="{qid}-btn"><div class="acc-inner"><p>{a}</p></div></div>')
        out.append('    </div>')
    out.append('  </div>')
out.append('</div>')
ld = {'@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
    {'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': plain(a)}}
    for _, _, qs in G for q, a, _ in qs]}
LD = '<script type="application/ld+json">' + json.dumps(ld, ensure_ascii=False).replace('</', '<' + chr(92) + '/') + '</script>'
open(OUT, 'w', encoding='utf8', newline=NL).write(NL.join(out) + NL)

# ---------- full page (/faq/) ----------
total = sum(len(qs) for _, _, qs in G); todo = sum(c for _, _, qs in G for *_, c in qs)
f = []
f.append('<!-- Full FAQ page body. Generated by scripts/gen-faq.py: edit the question list there, not this file. -->')
f.append('<div class="faqx" data-faq-page>')
f.append('  <aside class="faqx-side">')
f.append('    <nav class="faqx-toc" aria-label="Question topics">')
f.append('      <ul>')
for key, label, qs in G:
    f.append(f'        <li><a href="#{key}" data-toc="{key}">{{{{icon:{ICON[key]}}}}}<span class="faqx-toc-label">{html.escape(label)}</span><span class="faqx-count num" data-count-for="{key}">{len(qs)}</span></a></li>')
f.append('      </ul>')
f.append('    </nav>')
f.append('  </aside>')
f.append('  <div class="faqx-main">')
f.append('    <div class="faqx-empty" data-faq-empty hidden>')
f.append('      <span class="icon-tile">{{icon:message-circle-question}}</span>')
f.append('      <div>')
f.append('        <h2 class="faqx-empty-title">No questions match <span data-faq-term></span></h2>')
f.append('        <p>Try a shorter word such as <button class="faqx-try" type="button" data-try="credits">credits</button>, <button class="faqx-try" type="button" data-try="refund">refund</button> or <button class="faqx-try" type="button" data-try="GST">GST</button>, or email <a class="link" href="mailto:support@incoinfo.com">support@incoinfo.com</a> and we will answer it.</p>')
f.append('      </div>')
f.append('    </div>')
for key, label, qs in G:
    f.append(f'    <section class="faqx-group" id="{key}" aria-labelledby="{key}-title" data-group="{key}">')
    f.append(f'      <div class="faqx-group-head"><span class="icon-tile">{{{{icon:{ICON[key]}}}}}</span><h2 id="{key}-title">{HEAD[key]}</h2></div>')
    f.append('      <div class="faq" data-accordion>')
    for n, (q, a, confirm) in enumerate(qs, 1):
        qid = f'q-{key}-{n}'
        f.append('        <div class="acc-item">')
        f.append(f'          <h3><button class="acc-trigger" type="button" aria-expanded="false" aria-controls="{qid}" id="{qid}-btn">{html.escape(q, quote=False)} {{{{icon:plus|acc-icon}}}}</button></h3>')
        if confirm:
            f.append('          <!-- TODO: confirm this answer with the business -->')
        f.append(f'          <div class="acc-panel" id="{qid}" role="region" aria-labelledby="{qid}-btn"><div class="acc-inner"><p>{a}</p></div></div>')
        f.append('        </div>')
    f.append('      </div>')
    f.append('    </section>')
f.append('  </div>')
f.append('</div>')
f.append(LD)
open(OUT_ALL, 'w', encoding='utf8', newline=NL).write(NL.join(f) + NL)
print(f'wrote {OUT} and {OUT_ALL}: {len(G)} groups, {total} questions, {todo} marked TODO')
