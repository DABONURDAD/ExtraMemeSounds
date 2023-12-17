/**
 * @name ExtraMemeSounds
 * @version 0.6.1
 * @description Plays Memetastic sounds depending on what is being sent in chat. This was heavily inspired by the idea of Metalloriff's bruh plugin so go check him out!
 * @invite SsTkJAP3SE
 * @author Lonk#6942
 * @authorId 557388558017495046
 * @authorLink https://github.com/Lonk12/
 * @source https://github.com/Lonk12/BetterDiscordPlugins/blob/main/MemeSounds/MemeSounds.plugin.js
 * @updateUrl https://raw.githubusercontent.com/DABONURDAD/ExtraMemeSounds/main/MemeSounds/MemeSounds.plugin.js
 */

module.exports = (() => {
	
	/* Configuration */
	const config = {info: {name: "Meme Sounds", authors: [{name: "Lonk#6942", discord_id: "557388558017495046", github_username: "Lonk12", twitter_username: "wolfyypaw"},{name: "FlyMaster#2642", discord_id: "459726660359553025", github_username: "Apceniy"}], version: "0.6.1", description: "Plays Memetastic sounds depending on what is being sent in chat. This was heavily inspired by the idea of Metalloriff's bruh plugin so go check him out!", github: "https://github.com/Lonk12/BetterDiscordPlugins/blob/main/MemeSounds/MemeSounds.plugin.js", github_raw: "https://raw.githubusercontent.com/Lonk12/BetterDiscordPlugins/main/MemeSounds/MemeSounds.plugin.js"}, defaultConfig: [{id: "setting", name: "Sound Settings", type: "category", collapsible: true, shown: true, settings: [{id: "LimitChan", name: "Limit to the current channel only.", note: "When enabled, sound effects will only play within the currently selected channel.", type: "switch", value: true}, {id: "delay", name: "Sound effect delay.", note: "The delay in miliseconds between each sound effect.", type: "slider", value: 200, min: 10, max: 1000, renderValue: v => Math.round(v) + "ms"}, {id: "volume", name: "Sound effect volume.", note: "How loud the sound effects will be.", type: "slider", value: 1, min: 0.01, max: 1, renderValue: v => Math.round(v*100) + "%"}]}], changelog: [{title: "New Stuff", items: ["Added the vine boom sound effect when :moyai: is sent into chat.", "Thanks to Orangenal name#9280 for adding vine boom!"]}]};

	/* Library Stuff */
	return !global.ZeresPluginLibrary ? class {
		constructor() { this._config = config; }
        getName() {return config.info.name;}
        getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
        getDescription() {return config.info.description;}
        getVersion() {return config.info.version;}
		load() {BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {confirmText: "Download Now", cancelText: "Cancel", onConfirm: () => {require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (err, res, body) => {if (err) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9"); await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));});}});}
		start() { }
		stop() { }
	} : (([Plugin, Api]) => {

		const plugin = (Plugin, Api) => { try {
			
			/* Constants */
			const {DiscordModules: {Dispatcher, SelectedChannelStore}} = Api;
			const sounds = [
				{re: /no?ice/gmi, file: "noice.mp3", duration: 600},
				{re: /bazinga/gmi, file: "bazinga.mp3", duration: 550},
				{re: /oof/gmi, file: "oof-minecraft.mp3", duration: 1000},
				{re: /bruh/gmi, file: "bruh.mp3", duration: 470},
				{re: /bru/gmi, file: "bruh.mp3", duration: 470},
				{re: /🗿/gmi, file: "moyai.mp3", duration: 100},
				{re: /moai/gmi, file: "moyai.mp3", duration: 100},
			        {re: /moyai/gmi, file: "moyai.mp3", duration: 100},
				{re: /wow/gmi, file: "anime-wow.mp3", duration: 400},
				{re: /wo?ah/gmi, file: "anime-wow.mp3", duration: 4000},
				{re: /💀/gmi, file: "badtothebone.mp3", duration: 5000},
				{re: /☠️/gmi, file: "badtothebone.mp3", duration: 5000},
				{re: /im dead/gmi, file: "badtothebone.mp3", duration: 5000},
				{re: /bing/gmi, file: "bing-chilling.mp3", duration: 2000},
				{re: /bonk/gmi, file: "bonk.mp3", duration: 432},
				{re: /deja/gmi, file: "deja-vu.mp3", duration: 6000},
				{re: /french/gmi, file: "french.mp3", duration: 5000},
				{re: /baugette/gmi, file: "french.mp3", duration: 5000},
				{re: /🥖/gmi, file: "french.mp3", duration: 5000},
				{re: /🥐/gmi, file: "french.mp3", duration: 5000},
				{re: /gas/gmi, file: "gas-gas-gas.mp3", duration: 8000},
				{re: /hello/gmi, file: "hello-there.mp3", duration: 2000},
				{re: /holy/gmi, file: "holy-moly.mp3", duration: 1000},
				{re: /it is what/gmi, file: "it-is-what-it-is.mp3", duration: 4000},
				{re: /it e?? what/gmi, file: "it-is-what-it-is.mp3", duration: 4000},
				{re: /rizz/gmi, file: "lightskin-rizz-sin-city.mp3", duration: 7000},
				{re: /lightskin/gmi, file: "lightskin-rizz-sin-city.mp3", duration: 7000},
				{re: /rizz/gmi, file: "lightskin-rizz-sin-city.mp3", duration: 7000},
				{re: /huh/gmi, file: "loading.mp3", duration: 2000},
				{re: /huh?/gmi, file: "loading.mp3", duration: 2000},
				{re: /??/gmi, file: "loading.mp3", duration: 2000},
				{re: /okay/gmi, file: "meme-okay-lets-go.mp3", duration: 8000},
				{re: /mrbeast/gmi, file: "mrbeast.mp3", duration: 5000},
				{re: /mr beast/gmi, file: "mrbeast.mp3", duration: 5000},
				{re: /???beast/gmi, file: "mrbeast.mp3", duration: 5000},
				{re: /oh hell/gmi, file: "oh-hell-nah.mp3", duration: 5000},
				{re: /oh no/gmi, file: "oh-no-no.mp3", duration: 18000},
				{re: /owo/gmi, file: "owo-choco.mp3", duration: 7000},
				{re: /choco/gmi, file: "owo-choco.mp3", duration: 7000},
				{re: /shadow wizard money/gmi, file: "shadow-wizard-money-gang.mp3",  duration: 3000},
				{re: /siren/gmi, file: "siren.mp3", duration: 6000},
				{re: /🚨/gmi, file: "siren.mp3", duration: 6000},
				{re: /📢/gmi, file: "siren.mp3", duration: 6000},
				{re: /slep/gmi, file: "snore-mimimimimimi.mp3", duration: 5000},
				{re: /sle?p/gmi, file: "snore-mimimimimimi.mp3", duration: 5000},
				{re: /spooderman/gmi, file: "sspooderman.mp3", duration: 5000},
				{re: /sui?/gmi, file: "suiiiiiiiiiii.mp3", duration: 1000},
				{re: /dog/gmi, file: "wat da dog doin.mp3", duration: 1000},
				{re: /wee?/gmi, file: "weeee.mp3", duration: 9000},
				{re: /what?/gmi, file: "what-bottom-text.mp3", duration: 5000},
				{re: /gay/gmi, file: "why-are-you-gay.mp3", duration: 6000},
				{re: /error/gmi, file: "windows-error.mp3", duration: 1000},
				{re: /yeah/gmi, file: "yeah-boi.mp3", duration: 1000},

				{re: /boi?/gmi, file: "yeah-boi.mp3", duration: 1000},
				
				{re: /japan/gmi, file: "yooooooooooo.mp3", duration: 10000}
			];

			/* Double message event fix */
			let lastMessageID = null;

			/* Meme Sounds Class */
			return class MemeSounds extends Plugin {
				constructor() {
					super();
				}

				getSettingsPanel() {
					return this.buildSettingsPanel().getElement();
				}
	
				onStart() {
					Dispatcher.subscribe("MESSAGE_CREATE", this.messageEvent);
				}
				
				messageEvent = async ({ channelId, message, optimistic }) => {
					if (this.settings.setting.LimitChan && channelId != SelectedChannelStore.getChannelId())
						return;

					if (!optimistic && lastMessageID != message.id) {
						lastMessageID = message.id;
						let queue = new Map();
						for (let sound of sounds) {
							for (let match of message.content.matchAll(sound.re))
								queue.set(match.index, sound);
						}
						for (let sound of [...queue.entries()].sort((a, b) => a[0] - b[0])) {
							let audio = new Audio("https://github.com/DABONURDAD/ExtraMemeSounds/raw/main/MemeSounds/Sounds/"+sound[1].file);
							audio.volume = this.settings.setting.volume;
							audio.play();
							await new Promise(r => setTimeout(r, sound[1].duration+this.settings.setting.delay));
						}
					}
					
				};
				
				onStop() {
					Dispatcher.unsubscribe("MESSAGE_CREATE", this.messageEvent);
				}
			}
		} catch (e) { console.error(e); }};
		return plugin(Plugin, Api);
	})(global.ZeresPluginLibrary.buildPlugin(config));
})();
