module.exports = function antiBodyBlock(dispatch) {
  const command = require("command")(dispatch);
  const partyMembers = new Set();
  const cache = Object.create(null);
  const partyObj = Object.create(null);
  let interval = null;
  let enabled = false;

  partyObj.unk4 = 1;

  const removeBodyBlock = () => {
    for (let i = partyMembers.values(), step; !(step = i.next()).done; ) {
      partyObj.leader = step.value;
      partyObj.unk1   = cache.unk1;
      partyObj.unk2   = cache.unk2;
      partyObj.unk3   = cache.unk3;
      dispatch.toClient("S_PARTY_INFO", 1, partyObj);
    }
  };

  command.add("bb", () => {
    enabled = !enabled;
    if (enabled) {
      interval = setInterval(removeBodyBlock, 5000);
    }
    else {
      clearInterval(interval);
    }
    command.message("Anti-bodyblock enabled: " + enabled);
  });

  dispatch.hook("S_PARTY_INFO", 1, evt => { Object.assign(cache, evt); });
  dispatch.hook("S_PARTY_MEMBER_LIST", 5, evt => {
    partyMembers.clear();
    for (let i = 0, arr = evt.members, len = arr.length; i < len; ++i) {
      const member = arr[i];
      if (!member.online) continue;
      partyMembers.add(member.cid);
    }
  });
};
