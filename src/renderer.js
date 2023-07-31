const {
    createAgoraRtcEngine,
    VideoMirrorModeType,
    VideoSourceType,
    RenderModeType,
    ChannelProfileType,
    ClientRoleType,
} = require("agora-electron-sdk");

let rtcEngine;
let localVideoContainer;
let remoteVideoContainer;
let isJoined = false;
let token = "";
let uid = 123456;

const EventHandles = {
    onJoinChannelSuccess: ({ channelId, localUid }, elapsed) => {
        console.log('Joined channel: ' + channelId);
        isJoined = true;
        rtcEngine.setupLocalVideo({
            sourceType: VideoSourceType.VideoSourceCameraPrimary,
            view: localVideoContainer,
            mirrorMode: VideoMirrorModeType.VideoMirrorModeDisabled,
            renderMode: RenderModeType.RenderModeFit,
        });
    },

    onLeaveChannel: ({ channelId, localUid }, stats) => {
        console.log('left channel: ' + channelId);
        isJoined = false;
    },

    onUserJoined: ({ channelId, localUid }, remoteUid, elapsed) => {
        console.log('Remote ' + remoteUid + ' joined channel successfully');
        rtcEngine.setupRemoteVideoEx(
            {
                sourceType: VideoSourceType.VideoSourceRemote,
                uid: remoteUid,
                view: remoteVideoContainer,
                mirrorMode: VideoMirrorModeType.VideoMirrorModeDisabled,
                renderMode: RenderModeType.RenderModeFit,
            },
            { channelId },
        );
    },
};

window.onload = () => {
    const os = require("os");
    const path = require("path");

    const APPID = "c61e30466a2942ed9f9e840b760e9a5b";
    const channel = "testChannel";

    localVideoContainer = document.getElementById("join-channel-local-video");
    remoteVideoContainer = document.getElementById("join-channel-remote-video");
    const sdkLogPath = path.resolve(os.homedir(), "./test.log");

    rtcEngine = createAgoraRtcEngine();

    rtcEngine.initialize({
        appId: APPID,
        logConfig: { filePath: sdkLogPath }
    });

    rtcEngine.registerEventHandler(EventHandles);

    rtcEngine.setChannelProfile(ChannelProfileType.ChannelProfileLiveBroadcasting);

    rtcEngine.setClientRole(ClientRoleType.ClientRoleBroadcaster);

    rtcEngine.enableVideo();

    rtcEngine.startPreview();

    rtcEngine.joinChannel(token, channel, uid, {});
};
