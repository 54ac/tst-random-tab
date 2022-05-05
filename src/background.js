"use strict";

const TST_ID = "treestyletab@piro.sakura.ne.jp";

let tstTab;

const refreshMenu = async (enabled) => {
	await browser.menus.update("tstRandomTab", { enabled });
	browser.menus.refresh();
};

const getTreeInfo = (tab) =>
	browser.runtime.sendMessage(TST_ID, {
		type: "get-tree",
		tab
	});

browser.menus.create({
	id: "tstRandomTab",
	title: "Select random tab",
	contexts: ["tab"]
});

browser.menus.onShown.addListener(async (info, { id }) => {
	tstTab = await getTreeInfo(id);

	// disable if less than 2 children in selected tab or its parent
	if (tstTab.children.length < 2 && !tstTab.ancestorTabIds.length) {
		refreshMenu(false);
		return;
	}
	if (!tstTab.children.length && tstTab.ancestorTabIds.length) {
		tstTab = await getTreeInfo(
			// length -1 is nearest parent tab in array
			tstTab.ancestorTabIds[tstTab.ancestorTabIds.length - 1]
		);

		if (tstTab.children.length < 2) {
			refreshMenu(false);
			return;
		}
	}

	refreshMenu(true); // would stay disabled otherwise
});

browser.menus.onClicked.addListener(({ menuItemId }, tab) => {
	if (menuItemId !== "tstRandomTab") return;

	const tabIds = tstTab.children.map((c) => c.id);
	const pick = tabIds[Math.floor(Math.random() * tabIds.length)];
	browser.tabs.update(pick, { active: true });
});
