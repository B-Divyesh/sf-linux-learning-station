# Copy audit — repair 4

The rendered landing page was read in order at 390 px and desktop width. Counts use whitespace-separated words. Every sentence is 22 words or fewer, no banned marketing term appears, and every action names its result. Claim-like copy maps to the tagged tests in `.factory/claims.json`.

| Copy | Words | Result |
| --- | ---: | --- |
| Skip to activities | 3 | Pass |
| Linux Learning Station | 3 | Pass |
| Demo | 1 | Pass |
| Privacy | 1 | Pass |
| Online / Ready offline / Offline | 1 / 2 / 1 | Pass |
| Adult tools | 2 | Pass |
| Offline activities for shared Linux computers | 6 | Pass |
| Start offline learning activities | 4 | Pass |
| For parents and teachers setting up a shared computer for children aged 5–10. | 13 | Pass |
| Try it with sample data | 5 | Pass |
| Opens all six activities with ages 7–8 sample progress. | 9 | Pass |
| Nothing is saved to your real station. | 7 | Pass |
| Six core activities are free | 5 | Pass |
| Progress stays on this computer | 5 | Pass |
| Works offline after the first visit | 6 | Pass |
| Optional bundle: ₹499 once | 4 | Pass |
| Choose an age range | 5 | Pass |
| Start activities for ages 5–6 / 7–8 / 9–10 | 5 | Pass — `age-ranges` |
| Open the station board | 4 | Pass |
| Patterns, typing, logic, spelling, numbers, and drawing. | 7 | Pass |
| Three steps | 2 | Pass |
| How it works | 3 | Pass |
| Choose an age range. | 4 | Pass |
| Pick ages 5–6, 7–8, or 9–10. | 6 | Pass |
| Start any activity. | 3 | Pass |
| Five guided activities have three short rounds. | 7 | Pass — `core-session-shape` |
| Drawing is one open session. | 5 | Pass — `core-session-shape` |
| Keep progress locally. | 3 | Pass |
| Adults can print, export, import, or erase it. | 8 | Pass |
| No child account or tracking | 5 | Pass |
| The station does not send activity progress to us. | 9 | Pass |
| It has no ads, chat, cloud profile, or third-party scripts. | 10 | Pass |
| Read the privacy details | 4 | Pass |
| Optional activity bundle — ₹499 once | 6 | Pass |
| Adds five-round sessions and detailed printouts. | 6 | Pass |
| Every core activity stays free. | 5 | Pass |
| Buy workshop bundle — ₹499 | 4 | Pass — `checkout-purchase` follows the checkout redirect |
| Opens secure Sociobot checkout. | 4 | Pass |
| After payment, return here to use the bundle. | 8 | Pass |
| Already bought it? | 3 | Pass |
| Restore the license in Adult tools. | 6 | Pass — `paid-bundle` uses the visible form |
| Six local activities for shared Linux computers. | 7 | Pass |
| Built by Param Factory | 4 | Pass |
| v1.2.4 | 1 | Pass |
| A rugged concrete computer desk with moss, a keyboard, paper objects, and a blank screen | 15 | Pass |

## Demo board action audit

| Visible action | Words | Result |
| --- | ---: | --- |
| Start Pattern Quarry | 3 | Pass |
| Start Key Trail | 3 | Pass |
| Start Logic Bridges | 3 | Pass |
| Start Word Workshop | 3 | Pass |
| Start Number Stones | 3 | Pass |
| Start Moss Sketchbook | 3 | Pass |
| Reset demo | 2 | Pass |
| Start for real | 3 | Pass |

The Terms installation sentence has 19 words and uses “station,” not the implementation term “PWA.” Purchase, refund, and revocation wording now matches the registered Sociobot/Dodo product contract.

## Terminology

| Concept | Product term |
| --- | --- |
| Child setup choice | age range |
| Learning task | activity |
| Sample mode | demo |
| Saved results | progress |
| Installable product | station |
