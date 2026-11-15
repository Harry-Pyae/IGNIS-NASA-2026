# Burmese (MY) review — R3

**Status: UNREVIEWED draft.** Source: `src/i18n/my.draft.ts` (generated 2026-11-11; regenerate after key changes).

**Rule (Team Plan R3, DECISIONS-ROUND5 #2):** Burmese ships **complete and reviewed**, or the app stays EN-only. A partial set never ships.

The draft comes from a teammate's practice build (Pyroverse, used with her permission): strings only. Her build covers a different UI (3D chamber, audit, chatbot), so only **3 of our 144 keys** have a direct equivalent. The rest are blank for you to write; the glossary in §2 has her terms.

**How to review:**
- Fill *R3 translation* for every key (keep her draft or replace it), then tick *Native ✓* and *Scientific ✓* once checked.
- Keep scientific terms consistent with the glossary.
- Never make the approved meaning stronger: absence stays "no matching verified evidence in the current IGNIS catalog" (never "NASA never tested"); no "predict", "safe" or "approved".
- When every row has both ticks, send this file to Coder A, who promotes it into `src/i18n/index.ts`.

## 1. UI strings (144 keys)

| Key | English | Her draft | R3 translation | Native ✓ | Scientific ✓ | Notes |
|---|---|---|---|---|---|---|
| `missionScenario` | Mission scenario |  |  |  |  |  |
| `evidenceMap` | Evidence map |  |  |  |  |  |
| `matchPanel` | Match panel |  |  |  |  |  |
| `missionBrief` | Mission brief |  |  |  |  |  |
| `evidenceGapRadar` | Evidence gap radar |  |  |  |  |  |
| `describeStep` | 01 · Describe |  |  |  |  |  |
| `retrieveStep` | 02 · Retrieve |  |  |  |  |  |
| `matchesStep` | 03 · Why these |  |  |  |  |  |
| `briefStep` | 04 · Evidence-validated claims |  |  |  |  |  |
| `gapStep` | 05 · Research prioritization |  |  |  |  |  |
| `scenarioPresets` | Scenario presets |  |  |  |  |  |
| `environments` | Environments | လေထုပုံစံများ |  |  |  |  |
| `custom` | Custom |  |  |  |  |  |
| `scenarioPresetsStart` | Start with a preset |  |  |  |  |  |
| `orDescribeScenario` | Or describe a scenario |  |  |  |  |  |
| `scenarioExample` | Example: PMMA wall panel, 21% oxygen, 10 cm/s airflow |  |  |  |  |  |
| `parseScenario` | Parse scenario |  |  |  |  |  |
| `parsing` | Parsing… |  |  |  |  |  |
| `material` | Material | ပစ္စည်း |  |  |  |  |
| `form` | Form |  |  |  |  |  |
| `notSpecified` | Not specified |  |  |  |  |  |
| `notReported` | Not reported |  |  |  |  |  |
| `setAirflow` | Set airflow to 0 cm/s |  |  |  |  |  |
| `clearAirflow` | Clear airflow |  |  |  |  |  |
| `setOxygen` | Set to 21% (cabin air) |  |  |  |  |  |
| `clearOxygen` | Clear oxygen |  |  |  |  |  |
| `enterMaterial` | Enter a material |  |  |  |  |  |
| `selectMaterial` | Select material |  |  |  |  |  |
| `chooseCatalogMaterial` | Choose a verified catalog material to continue. |  |  |  |  |  |
| `chooseAmbiguousMaterial` | Choose which catalog material you mean. |  |  |  |  |  |
| `catalogMaterialsUnavailable` | Verified catalog materials could not be loaded. |  |  |  |  |  |
| `retry` | Retry |  |  |  |  |  |
| `confirmScenario` | Confirm scenario |  |  |  |  |  |
| `edit` | Edit |  |  |  |  |  |
| `outcome` | Outcome |  |  |  |  |  |
| `missionBack` | Back |  |  |  |  |  |
| `missionNext` | Next |  |  |  |  |  |
| `missionDone` | Done |  |  |  |  |  |
| `exploreFreely` | Explore freely |  |  |  |  |  |
| `guidedMission` | Guided mission |  |  |  |  |  |
| `missionStepOf` | Step {n} of {total} |  |  |  |  |  |
| `missionProgress` | Guided mission steps |  |  |  |  |  |
| `goToMissionStep` | Go to step |  |  |  |  |  |
| `missionStepScenario` | Describe the scenario |  |  |  |  |  |
| `missionStepMap` | Inspect the observations |  |  |  |  |  |
| `missionStepMatches` | Compare the matched tests |  |  |  |  |  |
| `missionStepBrief` | Read the evidence brief |  |  |  |  |  |
| `missionStepGaps` | Check the evidence gaps |  |  |  |  |  |
| `missionCaptionScenario` | Review the scenario inputs, then confirm them before comparing experiments. |  |  |  |  |  |
| `missionCaptionMap` | The map plots verified experiments with reported oxygen and airflow values. |  |  |  |  |  |
| `missionCaptionMatches` | Compare reported conditions, outcomes, observations, and source locations across the closest catalog matches. |  |  |  |  |  |
| `missionCaptionBrief` | Observed results and supported interpretations are shown separately; citations lead back to matched evidence. |  |  |  |  |  |
| `missionCaptionGaps` | Review the conditions where this catalog has no matching verified evidence. |  |  |  |  |  |
| `understandResearch` | Understand the research |  |  |  |  |  |
| `whereItHappened` | Where it happened |  |  |  |  |  |
| `whatItStudied` | What it studied |  |  |  |  |  |
| `whyItMatters` | Why it matters |  |  |  |  |  |
| `confirmedMatches` | ranked matches ready |  |  |  |  |  |
| `confirmed` | Confirmed |  |  |  |  |  |
| `confirmedCatalog` | Scenario confirmed. Results use verified catalog records only. |  |  |  |  |  |
| `confirmedCatalogUnavailable` | Scenario confirmed. Connect the verified catalog to retrieve experiment results. |  |  |  |  |  |
| `closestMatch` | Closest verified match |  |  |  |  |  |
| `confirmForClosestMatch` | Confirm the scenario to compare it with verified catalog experiments. |  |  |  |  |  |
| `editScenario` | Edit scenario |  |  |  |  |  |
| `noMatchCatalog` | Catalog is unavailable, so there are no verified matches to compare yet. |  |  |  |  |  |
| `noEligibleMatchesForScenario` | No verified catalog experiments match this scenario yet. |  |  |  |  |  |
| `catalogConnecting` | Connecting to the verified experiment catalog… |  |  |  |  |  |
| `catalogNotConnected` | Catalog not connected. Add SUPABASE_URL and SUPABASE_ANON_KEY to your local .env file, then restart the dev server. |  |  |  |  |  |
| `mapNoPoints` | No verified records with both oxygen and airflow values are available to plot yet. |  |  |  |  |  |
| `mapAccessibility` | Evidence map plotting oxygen against airflow |  |  |  |  |  |
| `mapVerifiedTitle` | Verified experiment outcomes by airflow and oxygen concentration |  |  |  |  |  |
| `airflowAxis` | Airflow (cm/s) | လေစီးနှုန်း (cm/s) |  |  |  |  |
| `oxygenAxis` | O₂ (%) |  |  |  |  |  |
| `sustained` | Sustained |  |  |  |  |  |
| `extinguished` | Extinguished |  |  |  |  |  |
| `transition` | Transition |  |  |  |  |  |
| `partial` | Partial |  |  |  |  |  |
| `outcomeNotReported` | Outcome not reported |  |  |  |  |  |
| `scenario` | Scenario |  |  |  |  |  |
| `untestedCell` | Untested cell |  |  |  |  |  |
| `outsideAxesRecords` | records fall outside the plotted axes and are not shown. |  |  |  |  |  |
| `outsideAxesRecord` | record falls outside the plotted axes and is not shown. |  |  |  |  |  |
| `outsideCatalogRange` | Outside catalog range |  |  |  |  |  |
| `plotted` | plotted |  |  |  |  |  |
| `rankedMatches` | ranked matches |  |  |  |  |  |
| `confirmForMatches` | Confirm a scenario to see the closest eligible experiments. |  |  |  |  |  |
| `waitingCatalog` | Waiting for the verified catalog snapshot. |  |  |  |  |  |
| `matchCatalogUnavailable` | Catalog not connected. Connect the verified catalog to load experiment matches. |  |  |  |  |  |
| `noVerifiedMatches` | No eligible verified experiments match this scenario in the current catalog. |  |  |  |  |  |
| `match` | Match |  |  |  |  |  |
| `sourceExcerpt` | Source excerpt |  |  |  |  |  |
| `nasaPaperPdf` | NASA paper PDF |  |  |  |  |  |
| `source` | Source |  |  |  |  |  |
| `confirmForBrief` | Confirm a scenario to build its evidence-checked brief. |  |  |  |  |  |
| `noBriefMatches` | No matched experiments are available for a mission brief. |  |  |  |  |  |
| `preparingBrief` | Preparing the evidence-checked brief… |  |  |  |  |  |
| `buildingBrief` | Building the mission brief from matched records… |  |  |  |  |  |
| `matchedEvidenceOnly` | Matched evidence only |  |  |  |  |  |
| `observed` | Observed |  |  |  |  |  |
| `supportedInterpretation` | Supported interpretation |  |  |  |  |  |
| `untested` | Untested |  |  |  |  |  |
| `gap` | Gap |  |  |  |  |  |
| `catalogUnavailableForMaterials` | Verified catalog materials could not be loaded. |  |  |  |  |  |
| `loadingCoverage` | Loading catalog coverage… |  |  |  |  |  |
| `coverageUnavailable` | Catalog not connected. Connect the verified catalog to load evidence coverage. |  |  |  |  |  |
| `noScenarioRange` | No eligible records in this scenario provide both oxygen and airflow values, so there is no measured range for ranking gaps. |  |  |  |  |  |
| `noCatalogRange` | No verified records provide both oxygen and airflow values, so there is no measured range for ranking gaps. |  |  |  |  |  |
| `largestUntestedRegions` | Largest untested regions inside the catalog range |  |  |  |  |  |
| `region` | Region |  |  |  |  |  |
| `untestedCells` | untested cells |  |  |  |  |  |
| `noUntestedCells` | No untested cells were found inside the current catalog range. |  |  |  |  |  |
| `thinMaterials` | Materials with fewer than three verified records |  |  |  |  |  |
| `record` | record |  |  |  |  |  |
| `records` | records |  |  |  |  |  |
| `eligibleRecord` | eligible record |  |  |  |  |  |
| `eligibleRecords` | eligible records |  |  |  |  |  |
| `missingAxisRecord` | lacks oxygen or airflow values and is not plotted. |  |  |  |  |  |
| `missingAxisRecords` | lack oxygen or airflow values and are not plotted. |  |  |  |  |  |
| `loading` | Loading… |  |  |  |  |  |
| `outcomeUnreported` | Outcome unreported |  |  |  |  |  |
| `beyondCatalogRange` | Beyond the current catalog range |  |  |  |  |  |
| `noPlottedTest` | No plotted test in this oxygen and airflow cell |  |  |  |  |  |
| `catalogEnvelope` | Current catalog envelope |  |  |  |  |  |
| `thicknessMm` | Thickness (mm) |  |  |  |  |  |
| `pressureKpa` | Pressure (kPa) |  |  |  |  |  |
| `matched` | matched |  |  |  |  |  |
| `eligible` | eligible |  |  |  |  |  |
| `oxygenNotReported` | O₂ not reported |  |  |  |  |  |
| `airflowNotReported` | Airflow not reported |  |  |  |  |  |
| `sourcePage` | Source p. |  |  |  |  |  |
| `backToMap` | Back to evidence map |  |  |  |  |  |
| `openMatchCard` | Open its match card |  |  |  |  |  |
| `noUntestedWithinRange` | No untested cells were found inside the current catalog range. |  |  |  |  |  |
| `thinMaterialsHeading` | Materials with fewer than three verified records |  |  |  |  |  |
| `openDataset` | Open dataset (.json) |  |  |  |  |  |
| `backToTop` | Back to top |  |  |  |  |  |
| `oneIdea` | The one idea |  |  |  |  |  |
| `refusesToGuess` | IGNIS refuses to guess. It renders the absence of evidence as a visible, first-class feature. |  |  |  |  |  |
| `whatTestReported` | What a NASA test directly reported. |  |  |  |  |  |
| `carefulReading` | Careful reading across cited tests. |  |  |  |  |  |
| `noMatchingEvidence` | No matching verified evidence in the current catalog. Shown, never filled in. |  |  |  |  |  |
| `experimentDataSources` | Experiment data: NASA Technical Reports Server (NTRS) and NASA Physical Sciences Informatics (PSI). Each card links to and credits its own source. |  |  |  |  |  |
| `nasaDisclaimer` | IGNIS is an independent NASA Space Apps project. Not affiliated with or endorsed by NASA. |  |  |  |  |  |
| `brandingArt` | Illustrations on this page are branding — not NASA experiment imagery. |  |  |  |  |  |



## 1b. Added since the draft: Rounds 6–9 + tap feedback (241 keys)

Generated 2026-11-14 from `src/i18n/index.ts` (385 keys in total; the table above covers the first 144). Same rules as §1:
every row needs an R3 translation with both ticks before Burmese can ship. New in Round 9: the Help page, the
60-second case (two-run question), the grouped map legend, the language note on Methods.

| Key | English | R3 translation | Native ✓ | Scientific ✓ | Notes |
|---|---|---|---|---|---|
| `evidenceUnavailable` | Catalog unavailable |  |  |  |  |
| `notFoundEyebrow` | 404 / Navigation |  |  |  |  |
| `notFoundTitle` | Page not found |  |  |  |  |
| `notFoundIntro` | This address does not lead to an IGNIS page. |  |  |  |  |
| `notFoundHome` | Return to the mission console |  |  |  |  |
| `compareEyebrow` | Compare / verified catalog |  |  |  |  |
| `compareTitle` | Compare experiments |  |  |  |  |
| `compareLoading` | Loading verified experiments… |  |  |  |  |
| `compareUnavailable` | The verified catalog is unavailable. |  |  |  |  |
| `compareChoose` | Choose a verified experiment |  |  |  |  |
| `compareMissing` | These IDs are unavailable for comparison in the current IGNIS catalog. |  |  |  |  |
| `compareDistinct` | Select two distinct verified solid-material experiments to compare. |  |  |  |  |
| `methodsEyebrow` | Methods / evidence retrieval |  |  |  |  |
| `methodsTitle` | From scenario to source |  |  |  |  |
| `methodsIntro` | Follow a mission question through IGNIS and see where the software checks a statement before you read it. |  |  |  |  |
| `methodsPipeline` | Evidence pipeline |  |  |  |  |
| `methodsPrinciples` | Five principles behind the Brief |  |  |  |  |
| `methodsSources` | Browse the source bibliography |  |  |  |  |
| `plainWords` | Plain words |  |  |  |  |
| `libraryEyebrow` | Library / verified catalog |  |  |  |  |
| `libraryBack` | Back to library |  |  |  |  |
| `libraryLoading` | Loading verified catalog… |  |  |  |  |
| `libraryUnavailable` | The verified catalog is unavailable. |  |  |  |  |
| `librarySearch` | Search experiments |  |  |  |  |
| `libraryUnknown` | Not in the current IGNIS catalog |  |  |  |  |
| `libraryCite` | Cite this |  |  |  |  |
| `viewExperiment` | View experiment |  |  |  |  |
| `libraryNotReported` | not reported |  |  |  |  |
| `campaign` | Campaign |  |  |  |  |
| `libraryOutcome` | Observed outcome |  |  |  |  |
| `libraryMinimum` | Minimum |  |  |  |  |
| `libraryMaximum` | Maximum |  |  |  |  |
| `libraryDomain` | Domain |  |  |  |  |
| `libraryClass` | Material class |  |  |  |  |
| `libraryIgnition` | Ignition method |  |  |  |  |
| `librarySpread` | Spread rate |  |  |  |  |
| `libraryDetail` | Experiment detail |  |  |  |  |
| `libraryTitle` | Evidence Library |  |  |  |  |
| `libraryNoMatches` | No verified cards match these filters. |  |  |  |  |
| `libraryEmpty` | Verified experiments appear here as they are published. |  |  |  |  |
| `libraryCopied` | Citation copied. |  |  |  |  |
| `libraryInvalid` | Some catalog records could not be validated and are omitted. |  |  |  |  |
| `libraryInvalidRange` | Enter valid ranges with the minimum at or below the maximum. |  |  |  |  |
| `librarySorted` | Sorted by citation completeness |  |  |  |  |
| `libraryCompare` | Compare |  |  |  |  |
| `libraryAll` | All |  |  |  |  |
| `libraryVerifiedBy` | Verified by |  |  |  |  |
| `libraryLocator` | Locator |  |  |  |  |
| `methodsStages0` | Confirm the scenario |  |  |  |  |
| `methodsStages1` | Free text becomes editable conditions. A material alias resolves to a catalog name, or you choose the material yourself. Unspecified inputs stay blank. |  |  |  |  |
| `methodsStages2` | Retrieve verified experiments |  |  |  |  |
| `methodsStages3` | Only cards published by a named reviewer enter the catalog. Domain, material and form gates run before ranking. Oxygen, airflow, thickness and pressure are compared where reported; the match chips explain which conditions contributed. |  |  |  |  |
| `methodsStages4` | Check each statement |  |  |  |  |
| `methodsStages5` | The server checks the structure of the proposed Brief, its experiment IDs, and each cited field, value and unit against the retrieved cards. Observed sentences use checked facts; gaps come from the coverage check. |  |  |  |  |
| `methodsStages6` | Follow the evidence |  |  |  |  |
| `methodsStages7` | Read the observation or labelled interpretation, select its citation, then open the source at the location recorded on the card. Invalid statements are withheld. If narration fails, the matched evidence remains available. |  |  |  |  |
| `methodsPrinciples0` | Report observations |  |  |  |  |
| `methodsPrinciples1` | A recorded outcome describes the experiment in which it was observed. It is not a verdict on a new scenario. |  |  |  |  |
| `methodsPrinciples2` | Check every claim |  |  |  |  |
| `methodsPrinciples3` | Retrieve before narrating |  |  |  |  |
| `methodsPrinciples4` | Material resolution, eligibility, ranking and coverage follow fixed rules. The language model parses the scenario and narrates retrieved evidence; it does not choose the matches. |  |  |  |  |
| `methodsPrinciples5` | Keep scientific domains separate |  |  |  |  |
| `methodsPrinciples6` | Solid-material matches exclude smoke detection and liquid-droplet combustion. Research context is labelled separately. |  |  |  |  |
| `methodsPrinciples7` | Show the limits |  |  |  |  |
| `methodsPrinciples8` | Missing measurements stay missing. Source quotations retain the original units. An uncovered combination and a value outside the current catalog range are different findings. |  |  |  |  |
| `methodsDiagramTitle` | How the mission console builds a Brief |  |  |  |  |
| `methodsDiagramDesc` | Confirmed inputs and verified catalog cards feed deterministic retrieval. Retrieved cards and coverage feed claim validation. The console displays checked claims or the evidence-only fallback. |  |  |  |  |
| `compareExperiment` | Experiment |  |  |  |  |
| `compareUnavailableOption` | Unavailable |  |  |  |  |
| `libraryResultCount` | {results} results · {cards} verified {cardLabel} so far |  |  |  |  |
| `libraryCard` | card |  |  |  |  |
| `libraryCards` | cards |  |  |  |  |
| `libraryOxygen` | Oxygen |  |  |  |  |
| `libraryAirflow` | Airflow |  |  |  |  |
| `libraryThickness` | Thickness |  |  |  |  |
| `libraryPressure` | Pressure |  |  |  |  |
| `libraryConditionChange` | {field} changed from {from} to {to} {unit}. Stored value is {stored}. |  |  |  |  |
| `compareVerified` | Compare two verified experiments |  |  |  |  |
| `compareMatched` | Compare two matched experiments |  |  |  |  |
| `compareDescription` | Compare the reported conditions side by side. A difference between records does not explain a difference in outcomes. |  |  |  |  |
| `compareOpen` | Open comparison page |  |  |  |  |
| `compareVerifiedCaption` | Recorded conditions and observations of two verified experiments |  |  |  |  |
| `compareMatchedCaption` | Recorded conditions and observations of two matched experiments |  |  |  |  |
| `compareField` | Field |  |  |  |  |
| `compareDifference` | Entries differ |  |  |  |  |
| `methodsDiagramInputs` | Your inputs |  |  |  |  |
| `methodsDiagramCards` | Verified cards |  |  |  |  |
| `methodsDiagramRetrieval` | Retrieval + coverage |  |  |  |  |
| `methodsDiagramValidation` | Claim validation |  |  |  |  |
| `methodsDiagramBrief` | Brief + citations |  |  |  |  |
| `methodsClaimsGuarantee` | Observed and supported statements cite retrieved experiments, and the server checks each cited value against its card. Gaps are marked separately. |  |  |  |  |
| `methodsInterpretationLimit` | Interpretation of the cited experiments, not a direct observation. Checked references do not establish causation or equivalence between tests. |  |  |  |  |
| `helpLabel` | How to use this |  |  |  |  |
| `libraryConditions` | Reported conditions and observations |  |  |  |  |
| `librarySourceQuote` | Verbatim source observation |  |  |  |  |
| `helpHome` | Start with a preset, find matching experiments, then open a citation to check the original observation. |  |  |  |  |
| `helpScenario` | Choose a material and form. Leave conditions you do not know unspecified. |  |  |  |  |
| `helpMap` | Select a point to inspect its experiment. Check the evidence counts for runs without map coordinates. |  |  |  |  |
| `helpMatches` | Exact matches share the requested material. Class matches use a different material in the same class. Open a source to check the observation. |  |  |  |  |
| `helpBrief` | Select an evidence ID to open its card. If narration is unavailable or a claim is withheld, follow the available experiment sources. |  |  |  |  |
| `helpGaps` | Read each gap within the current IGNIS catalog. A hatched region has no verified card at those conditions. |  |  |  |  |
| `helpMethods` | Follow the pipeline to see how IGNIS checks a proposed statement against cited experiment fields before showing it. |  |  |  |  |
| `helpSources` | Open a paper or dataset by campaign, or export the verified catalog as JSON. |  |  |  |  |
| `helpLibrary` | Search or filter the verified cards. Clear your search and filters to return to the full catalog. |  |  |  |  |
| `helpDetail` | Read the original quote, check its source locator, and compare the normalized units in the conditions table. |  |  |  |  |
| `helpCompare` | Choose two distinct experiments. Check the changing-condition notes before comparing reported values. |  |  |  |  |
| `helpCurate` | Save a private draft, reopen it to review each field against its source, then publish under your name. |  |  |  |  |
| `helpKit` | Use this internal page to check shared components and their states. |  |  |  |  |
| `helpNotFound` | Use the home link to return to IGNIS. |  |  |  |  |
| `methodsLanguages` | Every interface string lives in one reviewed i18n layer. Adding a language is a translation task, not an engineering one, and a language ships only when it is complete and natively reviewed. Community translations are welcome. |  |  |  |  |
| `helpLinkHome` | How IGNIS works |  |  |  |  |
| `helpLinkScenario` | How to describe a scenario |  |  |  |  |
| `helpLinkMap` | How to read this map |  |  |  |  |
| `helpLinkMatches` | How matches are ranked |  |  |  |  |
| `helpLinkBrief` | How claims are checked |  |  |  |  |
| `helpLinkGaps` | How to read the gaps |  |  |  |  |
| `helpLinkMethods` | How to trace a claim to its source |  |  |  |  |
| `helpLinkSources` | How to trace a source |  |  |  |  |
| `helpLinkLibrary` | How to find and compare runs |  |  |  |  |
| `helpLinkDetail` | How to read a card |  |  |  |  |
| `helpLinkCompare` | How to compare two runs |  |  |  |  |
| `helpLinkCurate` | Curator guide |  |  |  |  |
| `helpNav` | Help |  |  |  |  |
| `helpEyebrow` | Help |  |  |  |  |
| `helpTitle` | How to use IGNIS |  |  |  |  |
| `helpIntro` | Short walkthroughs for each task. Your inputs are kept while you read. |  |  |  |  |
| `helpBack` | Back to where you were |  |  |  |  |
| `helpContents` | On this page |  |  |  |  |
| `helpPageStart` | Getting started |  |  |  |  |
| `helpStart1` | IGNIS finds verified NASA microgravity fire experiments that match a scenario and shows what they observed. It never fills in what was not tested. |  |  |  |  |
| `helpStart2` | Three ways in: try the 60-second case, pick a preset on the console, or browse the Library. |  |  |  |  |
| `helpPageDescribe` | Describe a scenario |  |  |  |  |
| `helpDescribe1` | Pick a preset, or Custom. Choose a material and its form: IGNIS only compares runs with a compatible material and form. |  |  |  |  |
| `helpDescribe2` | Set oxygen and airflow, or leave them Not specified. Unknown is allowed and is never filled in for you. Then select Find matching experiments. |  |  |  |  |
| `helpPageMap` | Read the evidence map |  |  |  |  |
| `helpMap1` | Airflow runs across, oxygen up. Each mark is one verified run; its shape and color show the observed outcome. Your scenario is the ring. |  |  |  |  |
| `helpMap2` | A hatched cell has no verified run in the current IGNIS catalog at those conditions. Select a mark, or a run by name, to open it. Runs missing oxygen or airflow are counted but not plotted. |  |  |  |  |
| `helpPageMatches` | How matches are ranked |  |  |  |  |
| `helpMatches1` | Runs are ordered by how close their reported conditions are to yours, not by material safety. |  |  |  |  |
| `helpMatches2` | An exact match shares your material; a class match uses a different material in the same class. Each chip shows same, close, not reported or untested for one condition. |  |  |  |  |
| `helpPageTrace` | Trace a claim to its source |  |  |  |  |
| `helpTrace1` | Every observed statement cites a run (E1, E2 …). Select it to open the card: the verbatim quote, its page, figure or table, and the source PDF. |  |  |  |  |
| `helpTrace2` | Before you see a statement, the server checks every value it cites against that card. A statement that fails is withheld and counted. See it happen in the 60-second case. |  |  |  |  |
| `helpPageFind` | Find and compare runs |  |  |  |  |
| `helpFind1` | The Library lists every verified card. Search, or filter by material, campaign, form, outcome, oxygen and airflow; your filters are kept when you come back. |  |  |  |  |
| `helpFind2` | Open a card for its full record, or Compare two runs side by side. Read any changing-condition note before comparing values. |  |  |  |  |
| `helpPageGaps` | Read the gaps |  |  |  |  |
| `helpGaps1` | The gap radar lists regions inside the catalog’s range with no verified run. A gap means no matching verified evidence in the current IGNIS catalog; it says nothing about safety either way. |  |  |  |  |
| `helpPageCurate` | For curators |  |  |  |  |
| `helpCurate1` | Internal. Enter the curator secret on /curate. Drafts to verify are listed first: reopen one, check every field against its source, then publish under your own full name. Never a placeholder or someone else’s name. |  |  |  |  |
| `helpGlossary` | Plain-language definitions of every term are on the Methods page. |  |  |  |  |
| `helpGlossaryLink` | Open the glossary |  |  |  |  |
| `caseEyebrow` | The 60-second case |  |  |  |  |
| `caseTitle` | Which fabric run used 10 cm/s? |  |  |  |  |
| `caseIntro` | Two verified NASA fabric tests at the same oxygen, with different airflow. Find the record, then check a claim against it. |  |  |  |  |
| `caseTitleFlash` | Start with what NASA saw |  |  |  |  |
| `caseBeat1` | The green flash |  |  |  |  |
| `caseInspect` | Inspect the green flash |  |  |  |  |
| `caseHideExplanation` | Hide the explanation |  |  |  |  |
| `caseNasaExplains` | What NASA says |  |  |  |  |
| `caseCheckedBy` | Checked against the source by {name} |  |  |  |  |
| `caseStep1` | 1 · The two runs |  |  |  |  |
| `caseStep2` | 2 · Does this number match the experiment record? |  |  |  |  |
| `caseRunFacts` | {material} · {form} · O₂ {o2} % · {outcome} |  |  |  |  |
| `caseInspectRow` | Inspect the source row |  |  |  |  |
| `caseHideRow` | Hide the source row |  |  |  |  |
| `caseRowCaption` | {table}, p.{page} |  |  |  |  |
| `caseRowWithdrawn` | The card no longer matches this transcribed row, so the row is not shown. Open the PDF to read it. |  |  |  |  |
| `caseOpenPdf` | Open the PDF at p.{page} |  |  |  |  |
| `caseObservation` | Observation (p.{page}) |  |  |  |  |
| `caseClaimRunLabel` | Run in the claim |  |  |  |  |
| `caseClaimValueLabel` | Airflow in the claim (cm/s) |  |  |  |  |
| `caseClaimUnit` | cm/s airflow. |  |  |  |  |
| `caseClaimVerb` | ran at |  |  |  |  |
| `caseCheck` | Check against the record |  |  |  |  |
| `caseChecking` | Checking… |  |  |  |  |
| `caseInvalid` | Enter the airflow as a number, in cm/s. |  |  |  |  |
| `caseYouChecked` | You checked: {run} at {value} cm/s |  |  |  |  |
| `caseWithheld` | Withheld |  |  |  |  |
| `caseAccepted` | Accepted |  |  |  |  |
| `caseFieldProof` | Airflow in the record: {value} cm/s |  |  |  |  |
| `caseSameCheck` | This is the same check every IGNIS brief passes before you see it. |  |  |  |  |
| `caseNoAi` | Deterministic: the claim is compared with the verified card. No AI is involved. |  |  |  |  |
| `caseLimitation` | Two rows alone cannot establish airflow as the cause of any difference between these runs. |  |  |  |  |
| `caseLocate` | Locate {run} on the map |  |  |  |  |
| `caseCompare` | Compare the two fabric runs |  |  |  |  |
| `caseCardsLoading` | Loading the verified cards… |  |  |  |  |
| `caseCatalogUnavailable` | The verified catalog could not be reached. This is a connection problem, not missing evidence. |  |  |  |  |
| `caseRunsMissing` | These runs are not in the current verified catalog, so there is nothing to check against. |  |  |  |  |
| `caseRateLimited` | Too many checks in a minute. Try again shortly. |  |  |  |  |
| `caseError` | The check could not run right now. This is a connection problem, not a verdict. Try again in a moment. |  |  |  |  |
| `caseCreditData` | Experiment data: NASA, {campaign} ({source}). |  |  |  |  |
| `legendRegion` | Evidence map legend |  |  |  |  |
| `legendExplained` | Tap for meaning |  |  |  |  |
| `legendKeyOnly` | Also on the map |  |  |  |  |
| `recoveryRegion` | Display error |  |  |  |  |
| `recoveryApp` | IGNIS could not display this page. |  |  |  |  |
| `recoveryHeader` | Navigation could not be displayed. The page is still available. |  |  |  |  |
| `recoveryPage` | This page failed to display. You can still use navigation. |  |  |  |  |
| `recoverySection` | This section failed to display. The other sections are still available. |  |  |  |  |
| `recoveryNamedSection` | {section} failed to display. The other sections are still available. |  |  |  |  |
| `whyRunAppeared` | Why did this run appear? |  |  |  |  |
| `inspectRequested` | Requested |  |  |  |  |
| `inspectReported` | Reported |  |  |  |  |
| `inspectClassMatch` | Shared material class: {class}. |  |  |  |  |
| `inspectExactMatch` | Exact material match. |  |  |  |  |
| `inspectDecisive` | {param}: {requested} {unit} requested · {reported} {unit} reported. |  |  |  |  |
| `inspectScenarioUnset` | not specified in the scenario |  |  |  |  |
| `inspectScenarioSet` | specified in the scenario |  |  |  |  |
| `inspectRunUnset` | not reported in the run |  |  |  |  |
| `inspectRunSet` | reported in the run |  |  |  |  |
| `inspectExperimentCard` | Experiment card |  |  |  |  |
| `inspectRecordedSource` | Recorded source |  |  |  |  |
| `whyNoMatches` | Why are there no matches? |  |  |  |  |
| `noMatchForms` | Requested form: {form}. Incompatible forms in otherwise eligible records: {forms}. |  |  |  |  |
| `noMatchMaterials` | {count} records in this domain have a different material and material class. |  |  |  |  |
| `browseCatalog` | Browse the verified catalog |  |  |  |  |
| `specimenExplorer` | Specimen Explorer |  |  |  |  |
| `specimenIntro` | Open a verified fabric run to inspect its reported conditions, quotation, and source locator. |  |  |  |  |
| `specimenSelectByName` | Select a run by name |  |  |  |  |
| `specimenInspect` | Inspect this run in the Library |  |  |  |  |
| `specimenLocate` | Locate this specimen on the Evidence Map |  |  |  |  |
| `handoffPrint` | Print evidence handoff |  |  |  |  |
| `handoffRegion` | Evidence handoff |  |  |  |  |
| `handoffTitle` | IGNIS evidence handoff |  |  |  |  |
| `handoffRevision` | Catalog revision: {revision} |  |  |  |  |
| `handoffScenario` | Scenario |  |  |  |  |
| `handoffFormUnset` | Form not specified |  |  |  |  |
| `handoffUnset` | not specified |  |  |  |  |
| `handoffNarrated` | Evidence-validated narration included. |  |  |  |  |
| `handoffPending` | Narration pending. Ranked evidence is included below. |  |  |  |  |
| `handoffRuns` | Ranked verified runs |  |  |  |  |
| `handoffRecordId` | Record ID |  |  |  |  |
| `handoffLocatorUnset` | Locator not reported |  |  |  |  |
| `mapSelected` | Selected {run} — details below the map |  |  |  | Screen-reader announcement; keep `{run}` |
| `mapSelectionCleared` | Selection cleared |  |  |  | Screen-reader announcement |
| `mapRegionOutlined` | Region {n} highlighted on the map: its {cells} untested cells |  |  |  | Keep `{n}`, `{cells}` |
| `mapRegionClear` | Clear highlight |  |  |  |  |
| `regionShowOnMap` | Show on the Evidence Map |  |  |  |  |
| `regionOnMap` | Highlighted on the Evidence Map |  |  |  |  |
| `copied` | Copied |  |  |  | Button label after copying a link or citation |

## 1c. Submission day: guided tour + walkthrough (18 keys)

Added 2026-11-15 to `src/i18n/index.ts` (403 keys in total). Same rules as §1. Also translate the label template
“Watch the {n}-second walkthrough” (`COPY.plain.walkthrough.label`) and “Recorded on catalog revision {revision}.”

| Key | English | R3 translation | Native ✓ | Scientific ✓ | Notes |
|---|---|---|---|---|---|
| `tourOffer` | New here? Take the 30-second tour — or jump straight in. |  |  |  |  |
| `tourStart` | Start tour |  |  |  |  |
| `tourDescribe` | Set a material and conditions. Anything you leave unspecified stays unspecified — IGNIS never fills it in. |  |  |  |  |
| `tourMap` | Each dot is a real NASA test, placed by oxygen and airflow. Hatched cells are untested. |  |  |  |  |
| `tourMatches` | Why each experiment appeared: what matches your scenario, what differs, and what its source didn’t report. |  |  |  |  |
| `tourBrief` | Every claim is checked against its source card. A claim that fails is withheld, and counted. |  |  |  |  |
| `tourGaps` | Where the evidence runs out: conditions no verified card covers in the current IGNIS catalog. |  |  |  |  |
| `tourStepOf` | Step {n} of {total} |  |  |  |  |
| `tourEndTitle` | That’s the tour |  |  |  |  |
| `tourEndBody` | Pick a way in. |  |  |  |  |
| `tourExplore` | Explore freely |  |  |  |  |
| `tourSkip` | Skip tour |  |  |  |  |
| `tourReplay` | Replay the tour |  |  |  |  |
| `walkthroughShort` | Watch the walkthrough |  |  |  |  |
| `walkthroughTitle` | IGNIS walkthrough |  |  |  |  |
| `walkthroughCaptioned` | Captions are burned into the video, so it works without sound. Transcript in Help. |  |  |  |  |
| `walkthroughClose` | Close video |  |  |  |  |
| `walkthroughTranscript` | Walkthrough transcript |  |  |  |  |

## 2. Glossary (terms from her strings)

| English | Her Burmese | Check | R3 ✓ |
|---|---|---|---|
| Oxygen | အောက်ဆီဂျင် |  |  |
| Airflow | လေစီးနှုန်း |  |  |
| Material | ပစ္စည်း |  |  |
| Fabric | အထည် |  |  |
| Solid (material) | အစိုင်အခဲ |  |  |
| Flame | မီးလျှံ |  |  |
| Smoke | မီးခိုး |  |  |
| Fuel droplet | လောင်စာအစက် |  |  |
| Extinguishment | ငြှိမ်းသတ် |  |  |
| Detection | ထောက်လှမ်းရေး |  |  |
| Prevention | ကြိုတင်ကာကွယ်ရေး |  |  |
| Suppression | မီးငြှိမ်းသတ်ရေး |  |  |
| Spacecraft | အာကာသယာဉ် |  |  |
| Microgravity environment | ဆွဲငင်အားမဲ့ပတ်ဝန်းကျင် |  |  |
| Spacesuit | အာကာသဝတ်စုံ |  |  |
| Moon | လကမ္ဘာ |  |  |
| Investigation / experiment | စမ်းသပ်မှု |  |  |
| Search | ရှာဖွေရေး |  |  |
| Back | ရှေ့သို့ | Her "Back" button. Reads as "forward"; looks swapped with Next. Check. |  |
| Next | နောက်သို့ | Her "Next" button. Reads as "behind"; looks swapped with Back. Check. |  |
| Done / close | ပိတ်မည် |  |  |

## 3. Burmese material phrases for the alias resolver (staged, not live)

Approved rows go into `MATERIAL_ALIASES` / `CLASS_HINTS` (`src/engine/aliases.ts`), and only for materials that exist in our catalog. Reject any phrase that could mean more than one material: the resolver never guesses.

| Phrase | Meaning | Proposed mapping | R3 ✓ | R1 ✓ (material) |
|---|---|---|---|---|
| နိုမက်စ် | Nomex (transliteration) | `nomex` (aramid_fabric) |  |  |
| ချည်နှင့် ဖန်မျှင်ရောစပ် အထည် | cotton and fiberglass blended fabric | `cotton_fiberglass` (fabric) |  |  |
| အထည် | fabric (a class, not a material) | class hint: `fabric` |  |  |

## 4. Context content (`src/lib/context-content.ts`)

Her Burmese exists only where her build had one without figures. R1 fact-checks the English first (`docs/FACT-CHECK-QUEUE.md`); then review or translate here.

| Entry | English | Her draft | R3 translation | Native ✓ | Scientific ✓ |
|---|---|---|---|---|---|
| `facility-cir` | An ISS research facility for combustion experiments. It hosted the ACME series of gaseous-flame experiments and, with the MDCA insert, droplet-combustion experiments. |  |  |  |  |
| `facility-mdca` | An insert for the CIR used for liquid fuel-droplet experiments such as FLEX. Droplet combustion appears here as context only; IGNIS catalogs solid materials. |  |  |  |  |
| `facility-msg` | An enclosed ISS work volume for smaller experiments. Solid-fuel flame-spread tests such as BASS and BASS-II ran in it, as did gaseous-flame tests such as SPICE and SLICE. |  |  |  |  |
| `facility-cygnus-saffire` | The Saffire experiments burned large material samples inside uncrewed Cygnus cargo vehicles after they left the ISS and before reentry, to study fire at spacecraft scale. |  |  |  |  |
| `psi-bass` | Studied how flames spread over, and go out on, solid fabrics and plastics in slow airflow in microgravity. | ဆွဲငင်အားမဲ့ပတ်ဝန်းကျင် လေစီးနှုန်းနိမ့်အတွင်း အစိုင်အခဲအထည်နှင့် ပလတ်စတစ်များ မီးကူးစက်မှုနှင့် ငြှိမ်းသတ်နိုင်စွမ်းကို တိုင်းတာခြင်း။ |  |  |  |
| `psi-saffire` | Measured how fire grows on spacecraft-scale material samples, and how its heat and combustion products spread, inside an uncrewed vehicle. | လူမဲ့အာကာသယာဉ်အတွင်း အရွယ်အစားကြီး အထည်နှင့် ပေါင်းစပ်ပစ္စည်းများ မီးကြီးထွားမှုနှင့် အပူထုတ်လွှတ်နှုန်းကို တိုင်းတာခြင်း။ |  |  |  |
| `psi-bre` | Burned gaseous fuels to emulate how solid materials burn in still air. | လေငြိမ်အာကာသအခန်းအတွင်း ဓာတ်ငွေ့လောင်စာဖြင့် အစိုင်အခဲပစ္စည်းများ၏ မီးလောင်လွယ်မှုကို တုပတွက်ချက်ခြင်း။ |  |  |  |
| `psi-spice-slice` | Studied when gaseous flames start to produce soot (SPICE) and how they lift off and blow out (SLICE) in a surrounding airflow. | လေစီးကြောင်းအတွင်း ကျပ်ခိုးစတင်ထွက်ရှိမှု အကန့်အသတ် (SPICE) နှင့် မီးလျှံတည်ငြိမ်မှု (SLICE) ကို တိုင်းတာခြင်း။ |  |  |  |
| `psi-acme-cfig-efield` | Studied gaseous flames in oxygen-enriched conditions, and how electric fields affect flames. |  |  |  |  |
| `psi-same` | Measured smoke particles from overheated materials in microgravity to improve spacecraft smoke detection. | အာကာသယာဉ် မီးဘေးကြိုတင်ထောက်လှမ်းမှု တိကျစေရန်နှင့် မှားယွင်းအချက်ပေးမှု လျှော့ချရန် မီးခိုးအမှုန်အရွယ်အစား တိုင်းတာခြင်း။ |  |  |  |
| `psi-daft` | Tested whether a smoke-detection instrument can measure airborne dust, to help tell dust apart from smoke. | လကမ္ဘာဖုန်မှုန့်နှင့် မီးခိုးကို ခွဲခြားထောက်လှမ်းနိုင်ရန် SAME မီးခိုးအာရုံခံကိရိယာကို ပြန်လည်အသုံးချ စမ်းသပ်ခြင်း။ |  |  |  |
| `psi-flex` | Burned isolated liquid fuel droplets to study how flames go out, including with diluent gases added. | ကာဗွန်ဒိုင်အောက်ဆိုဒ် (CO₂) နှင့် ဟီလီယမ် (Helium) ရောစပ်မှုအောက်တွင် လောင်စာအစက် မီးလောင်မှုနှင့် ငြှိမ်းသတ်မှုကို တိုင်းတာခြင်း။ |  |  |  |
| `psi-cfi-mist` | Studied "cool flames" around fuel droplets, and putting out fires with fine water mist. | ဆွဲငင်အားမဲ့ပတ်ဝန်းကျင်တွင် အေးမြမီးလျှံ (Cool Flames) နှင့် ရေမှုန်မွှား မီးငြှိမ်းသတ်စနစ်ကို လေ့လာခြင်း။ |  |  |  |
| `spinoff-water-mist` | Research on fire suppression with fine water mist in microgravity fed into water-mist systems used on Earth. |  |  |  |  |
| `spinoff-smoke-detection` | Smoke-particle measurements from SAME and DAFT inform smoke detectors that can tell dust or steam apart from smoke. |  |  |  |  |
| `spinoff-firefighter-gear` | Flame-resistant fabrics and lightweight breathing-air tanks developed for spaceflight are used by firefighters. |  |  |  |  |
| `heritage-apollo-1` | On 27 January 1967, fire swept the Apollo 1 command module during a ground test in a pure-oxygen cabin atmosphere, killing astronauts Virgil "Gus" Grissom, Edward White II and Roger Chaffee. NASA then changed the spacecraft's launch cabin atmosphere and its materials requirements. |  |  |  |  |

## 5. Inventory: every Burmese string in her build

Her build has **254 distinct Burmese strings** across 12 files (counted 2026-11-10; *with figures* = the string contains Western or Burmese digits). Sections 1–4 hold everything we took. The rest stays in her repo on purpose, for the reason given. Check a file there if you want her wording for a term.

| Her file | Strings | With figures | What we did |
|---|---|---|---|
| `context/LanguageContext.tsx` (her UI dictionary) | 40 | 11 | Equivalents mapped to our keys (§1) and terms in the glossary (§2). Strings for her own features have no key here. |
| `components/DemoGuideModal.tsx` | 16 | 4 | Step-guide pattern handed to Coder B (DECISIONS-ROUND5 #4); Back / Next noted in §2 (they look swapped). |
| `app/page.tsx`, `app/search/page.tsx` | 18 + 13 | 7 + 1 | Terms only, where we have the same concept (§2). |
| `lib/materialsData.ts` (her materials dataset) | 85 | 10 | Material names for catalog materials staged in §3. Descriptions, ratings and figures **not taken**: the dataset is unsourced. |
| `lib/ignisAiEngine.ts` | 60 | 24 | **Not taken**: generated burn behaviour and derived figures (rejected: derived burn formula, prediction). |
| `components/CustomMaterialModal.tsx` | 26 | 2 | **Not taken**: her custom-material scoring flow has no IGNIS equivalent. |
| `components/AuditReportPrint.tsx`, `app/audit/page.tsx` | 24 + 1 | 4 + 0 | **Not taken**: audit / compliance framing (rejected). |
| `components/AIInsightsPanel.tsx` | 10 | 2 | **Not taken**: chat / AI insights (rejected). |
| `app/dashboard/page.tsx` | 4 | 1 | **Not taken**: no equivalent surface. |
| `components/FlameChamber3D.tsx` | 2 | 1 | **Not taken**: 3D flame chamber (rejected). |

The per-file counts overlap where the same string appears in two files, so they add up to more than 254.
