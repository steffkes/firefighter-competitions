import streamlit as st
import datetime as dt
import altair as alt
import pandas as pd
from datetime import datetime, timedelta, timezone
import requests
import json
import os

st.set_page_config(page_title="Firefighter Competitions", layout="wide")

dfAll = pd.read_json("data/data/participants/counts.jsonl", lines=True)


with open("data/data/competitions.json") as data_file:
    foo = json.load(data_file)

competitionMap = {}
for record in foo:
    competitionMap[record["id"]] = "%s %s" % (
        datetime.fromisoformat(record["date"]["start"]).strftime("%d.%m.%y"),
        record["name"],
    )
    dfAll = dfAll[
        ~(
            (dfAll["competition"] == record["id"])
            & (dfAll["date"] >= record["date"]["start"])
        )
    ]


# r = requests.get("https://api.airtable.com/v0/appF8BPHzWCy6OKVF/tbl7nlGCJYqn3uF7C",
#                 headers={'Authorization': 'Bearer ' + os.environ["AIRTABLE_API_KEY"]})
#
# for record in (rec for rec in r.json()["records"] if "Datum" in rec["fields"]):
#    competitionMap[record["id"]] = "%s %s" % (datetime.strptime(record["fields"]["Datum"], "%Y-%m-%d").strftime("%d.%m.%y"), record["fields"]["Name"])
#    dfAll = dfAll[~((dfAll["competition"] == record["id"]) & (dfAll["date"] >= record["fields"]["Datum"]))]

dfAll["competitionName"] = dfAll["competition"].map(competitionMap)

# clean up test records
dfAll = dfAll[
    ~(
        (dfAll["competition"] == "recgwPH7vAXUg5PBu")
        & (dfAll["date"] < "2024-03-21T08:30:29.299Z")
    )
]  # Rottweil 2024
dfAll = dfAll[
    ~(
        (dfAll["competition"] == "recL95uxMRJ0CWcPT")
        & (dfAll["date"] < "2024-03-22T07:30:00.000Z")
    )
]  # Oberstdorf 2024

# past competitions
# dfAll = dfAll[~((dfAll["competition"] == "recxAxWccPrMWcVVv") & (dfAll["date"] >= "2024-04-13"))]
# dfAll = dfAll[~((dfAll["competition"] == "recro0bAFSmCCQZBP") & (dfAll["date"] >= "2024-04-21"))]


df = dfAll
df = df[df["count"] > 0]
df["date"] = pd.to_datetime(df["date"], format="ISO8601")
# df = df[df["count"] > 10]
#
colorMap = (
    df.sort_values("date", ascending=False)
    .drop_duplicates(subset=["competition"])
    .sort_values("count", ascending=False)
)
competitionList = list(colorMap["competitionName"])

lastWeekDf = df[df["date"] >= datetime.now(timezone.utc) - timedelta(days=14)]
numbersDf = (
    lastWeekDf.sort_values("date", ascending=False)
    .drop_duplicates(subset=["competition"])
    .sort_values("count", ascending=False)
)

st.altair_chart(
    alt.layer(
        alt.Chart(numbersDf, title="Highflyer-Anmeldungen im zeitlichen Verlauf (letzten zwei Woche)")
        .mark_text(dx=15)
        .encode(
            x=alt.X("date").title("Datum"),  # .axis(grid=True),
            y=alt.Y("count").title("Anzahl Anmeldungen").scale(domain=(498, 800), clamp=True),
            color=alt.Color("competitionName")
            .title("Veranstaltung")
            .legend(offset=30, labelLimit=300)
            .sort(list(numbersDf["competitionName"]))
            .scale(scheme="tableau20"),
            text="count",
        ),
        alt.Chart(lastWeekDf, title="Anmeldungen im zeitlichen Verlauf")
        .mark_line()
        .encode(
            x=alt.X("date").title("Datum"),  # .axis(grid=True),
            y=alt.Y("count").title("Anzahl Anmeldungen").scale(domain=(498, 800), clamp=True),
            color=alt.Color("competitionName")
            .title("Veranstaltung")
            .legend(offset=30, labelLimit=300)
            .sort(list(numbersDf["competitionName"]))
            .scale(scheme="tableau20"),
        ),
    ),
    use_container_width=True,
)

lastWeekDf = df[df["date"] >= datetime.now(timezone.utc) - timedelta(days=7)]
numbersDf = (
    lastWeekDf.sort_values("date", ascending=False)
    .drop_duplicates(subset=["competition"])
    .sort_values("count", ascending=False)
)

st.altair_chart(
    alt.layer(
        alt.Chart(numbersDf, title="Anmeldungen im zeitlichen Verlauf (letzte Woche)")
        .mark_text(dx=15)
        .encode(
            x=alt.X("date").title("Datum"),  # .axis(grid=True),
            y=alt.Y("count").title("Anzahl Anmeldungen").scale(type="log"),
            color=alt.Color("competitionName")
            .title("Veranstaltung")
            .legend(offset=30, labelLimit=300)
            .sort(list(numbersDf["competitionName"]))
            .scale(scheme="tableau20"),
            text="count",
        ),
        alt.Chart(lastWeekDf, title="Anmeldungen im zeitlichen Verlauf")
        .mark_line()
        .encode(
            x=alt.X("date").title("Datum"),  # .axis(grid=True),
            y=alt.Y("count").title("Anzahl Anmeldungen").scale(type="log"),
            color=alt.Color("competitionName")
            .title("Veranstaltung")
            .legend(offset=30, labelLimit=300)
            .sort(list(numbersDf["competitionName"]))
            .scale(scheme="tableau20"),
        ),
    ),
    use_container_width=True,
)

numbersDf = (
    df.sort_values("date", ascending=False)
    .drop_duplicates(subset=["competition"])
    .sort_values("count", ascending=False)
)

st.altair_chart(
    alt.layer(
        alt.Chart(
            pd.DataFrame(
                {
                    "marker": [
                        dt.datetime(year=2024, month=3, day=13, hour=13, minute=45),
                        dt.datetime(year=2024, month=3, day=14, hour=13, minute=45),
                    ]
                }
            )
        )
        .mark_rule(color="grey")
        .encode(x="marker"),
        # alt.Chart(pd.DataFrame({"marker": [
        #        dt.datetime(year=2024, month=3, day=13, hour=13, minute=45),
        #        dt.datetime(year=2024, month=3, day=14, hour=13, minute=45)
        #    ]})).mark_text(color="grey").encode(x="marker", y=alt.value(0), text=alt.value("Anpassung\nAuswertung"))
        # ,
        alt.Chart(numbersDf, title="Anmeldungen im zeitlichen Verlauf")
        .mark_text(dx=15)
        .encode(
            x=alt.X("date").title("Datum"),  # .axis(grid=True),
            y=alt.Y("count").title("Anzahl Anmeldungen").scale(type="log"),
            color=alt.Color("competitionName")
            .title("Veranstaltung")
            .legend(offset=30, labelLimit=300)
            .sort(list(numbersDf["competitionName"]))
            .scale(scheme="tableau20"),
            text="count",
        ),
        alt.Chart(df, title="Anmeldungen im zeitlichen Verlauf")
        .mark_line()
        .encode(
            x=alt.X("date").title("Datum"),  # .axis(grid=True),
            y=alt.Y("count").title("Anzahl Anmeldungen").scale(type="log"),
            color=alt.Color("competitionName")
            .title("Veranstaltung")
            .legend(offset=30, labelLimit=300)
            .sort(list(numbersDf["competitionName"]))
            .scale(scheme="tableau20"),
        ),
    ),
    use_container_width=True,
)

daily = (
    dfAll.groupby([df["date"].dt.date, df["competition"], df["competitionName"]])[
        "count"
    ]
    .agg(["first", "last"])
    .reset_index()
)
daily["count"] = daily["last"] - daily["first"]

dailyCleaned = daily[daily["count"] > 0]
dailyCleaned = dailyCleaned[dailyCleaned["competitionName"] != "TK Elevator Towerrun"]
# st.write(dailyCleaned)

st.altair_chart(
    alt.Chart(dailyCleaned, title="Anmeldungen pro Tag", height=50)
    .mark_bar()
    .encode(
        x=alt.X("yearmonthdate(date)").title("Datum"),
        y=alt.Y("count").title(None),
        color=alt.Color("competitionName")
        .title("Veranstaltung")
        .legend(None)
        .sort(list(numbersDf["competitionName"])),  # .scale(scheme="tableau10"),
        row=alt.Row("competitionName")
        .title(None)
        .header(labelAngle=0, labelAlign="left"),
    ),
    use_container_width=True,
)


if st.checkbox("raw"):
    st.write(daily)
    st.write(df)

today = df[df["date"] >= "2024-03-22"]
st.altair_chart(
    alt.layer(
        alt.Chart(numbersDf, title="Anmeldungen im zeitlichen Verlauf")
        .mark_text(dx=15)
        .encode(
            x=alt.X("date").title("Datum"),  # .axis(grid=True),
            y=alt.Y("count").title("Anzahl Anmeldungen").scale(type="log"),
            color=alt.Color("competitionName")
            .title("Veranstaltung")
            .legend(offset=30, labelLimit=200)
            .sort(list(numbersDf["competitionName"])),  # .scale(scheme="tableau10"),
            text="count",
        ),
        alt.Chart(today, title="Anmeldungen im zeitlichen Verlauf")
        .mark_line()
        .encode(
            x=alt.X("date").title("Datum"),  # .axis(grid=True),
            y=alt.Y("count").title("Anzahl Anmeldungen").scale(type="log"),
            color=alt.Color("competitionName")
            .title("Veranstaltung")
            .legend(offset=30, labelLimit=200)
            .sort(list(numbersDf["competitionName"])),  # .scale(scheme="tableau10"),
        ),
    ),
    use_container_width=True,
)

if st.checkbox("raw", key="raw_today"):
    st.write(today)

from pathlib import Path

participants = pd.concat(
    [pd.read_json(path) for path in Path("data/participants/").glob("*.json")]
)
participants["competitionName"] = participants["competition"].map(competitionMap)
participants = participants.drop(columns=["competition"])
st.write(participants)

participantsSchonach = list(
    participants[participants["competitionName"] == "Schonacher Schanzenlauf"][
        "participants"
    ].unique()
)
st.write(participantsSchonach)

participantsWildbadMissingSchonach = participants[
    (participants["competitionName"] == "Bad Wildbader Stäffeleslauf")
    & ~(participants["participants"].isin(participantsSchonach))
]
st.write(participantsWildbadMissingSchonach)


competitions = list(participants["competitionName"].unique())

test = participants.pivot_table(
    values="participants",
    index=["participants"],
    columns=["competitionName"],
    aggfunc="count",
)

test2 = test
test2["totalRuns"] = test2[competitions].sum(axis=1, skipna=True)
test2["totalCompetitions"] = test2[competitions].count(axis=1)
st.write(test2)

"""
# too many rows to visualize?
st.altair_chart(
    alt.layer(
        alt.Chart(participants, title="Verteilung der Anmeldungen")
        .mark_rect()
        .encode(
            y=alt.Y("participants"), #.axis(grid=True),
            x=alt.X("competitionName"),
            color="count():N"
        )
    ),
    use_container_width=False
)
"""
