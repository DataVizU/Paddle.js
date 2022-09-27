/**
 * @file 视频流类
 * @author xxx
 */

import 'hacktimer';

interface cameraOption {
    width?: number;
    height?: number;
    mirror?: boolean;
    enableOnInactiveState?: boolean;
    targetCanvas?: HTMLCanvasElement;
    onSuccess?: () => void;
    onError?: () => void;
    onNotSupported?: () => void;
    onFrame?: (target: HTMLCanvasElement | HTMLVideoElement) => void;
    switchError?: () => void;
    videoLoaded?: () => void;
}
export default class Camera {
    constructor(videoElement: HTMLVideoElement, opt: Partial<cameraOption> = {}) {
        this.video = videoElement;
        this.options = Object.assign({}, this.defaultOption, opt);
        this.currentMode = 'user';
        this.visible = true;
        this.isCameraRunning = true;
        this.initVideoStream();
        this.options.enableOnInactiveState && this.registerVisiblityEvent();
    }

    private noop = () => {};
    /** 默认配置对象 */
    private defaultOption: cameraOption = {
        mirror: false,
        enableOnInactiveState: false,
        targetCanvas: null,
        onSuccess: this.noop,
        onError: this.noop,
        onNotSupported: this.noop,
        onFrame: this.noop,
        switchError: this.noop,
        videoLoaded: this.noop
    };

    private options: cameraOption;
    private video: HTMLVideoElement;
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private requestAnimationId;
    private setTimeoutHandler;
    private stream: MediaStream;
    private videoDevices: string[];
    private videoDeviceId: string;
    private currentMode: string;
    private isIOS: boolean;
    private visible: boolean;
    private isCameraRunning: boolean;

    private initVideoStream() {
        const ua = navigator.userAgent;
        this.isIOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        this.video.width = this.options.width || this.video.clientWidth;
        this.video.height = this.options.height || this.video.clientHeight;
        // 枚举设备摄像头
        this.enumerateDevices();
    }

    private handleStream() {
        const videoConstraints = {
            deviceId: { exact: this.videoDeviceId },
            facingMode: this.currentMode,
            width: this.video.width,
            height: this.video.height
        };

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({
                video: videoConstraints
            }).then(stream => {
                this.stream = stream;
                this.streamCallback();
            }).catch(this.options.onError);
            return;
        }
        // @ts-ignore
        // eslint-disable-next-line max-len
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        if (navigator.getUserMedia) {
            navigator.getUserMedia({
                video: videoConstraints
            }, stream => {
                this.stream = stream;
                this.streamCallback();
            }, this.options.onError);
            return;
        }
        this.options.onNotSupported();
    }

    private enumerateDevices() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
            this.options.onNotSupported && this.options.onNotSupported();
            return;
        }
        navigator.mediaDevices.enumerateDevices()
            .then(devices => {
                const videoDevices = [];
                devices.forEach(device => {
                    if (device.kind === 'videoinput') {
                        videoDevices.push(device.deviceId);
                    }
                });
                this.videoDevices = videoDevices;
                if (this.videoDevices.length < 2 && !this.isIOS) {
                    this.options.switchError && this.options.switchError();
                }
                this.videoDeviceId = this.videoDevices[0];
                // 处理视频流
                this.handleStream();
            })
            .catch(err => {
                this.options.onNotSupported && this.options.onNotSupported();
                console.error(err.name + ': ' + err.message);
            });
    }

    private streamCallback() {
        this.options.onSuccess();
        // @ts-ignore
        const URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
        if ('srcObject' in this.video) {
            try {
                this.video.srcObject = this.stream;
            }
            catch (error) {
                this.video.src = URL.createObjectURL(this.stream) || this.stream;
            }
        }
        this.video.addEventListener('loadeddata', () => {
            // 设置视频流高度
            if (this.options.height) {
                this.video.width = this.video.clientWidth;
            }
            else {
                this.video.height = this.video.clientHeight;
            }

            this.options.videoLoaded && this.options.videoLoaded();
            this.initCanvas();
        });
    }

    private stopMediaTracks() {
        this.stream?.getTracks()?.forEach(track => {
            track.stop();
        });
    }

    private initCanvas() {
        if (!this.options.targetCanvas) {
            return;
        }
        this.canvas = this.options.targetCanvas;
        this.canvas.width = this.video.width;
        this.canvas.height = this.video.height;
        this.context = this.canvas.getContext('2d');
        // mirror video
        if (this.options.mirror) {
            this.context.translate(this.canvas.width, 0);
            this.context.scale(-1, 1);
        }
    }

    private videoRequestAnimationFrame() {
        if (this.visible) {
            this.drawImageRAF();
            return;
        }
        this.drawImageST();
    }

    private async drawImageRAF() {
        if (!this.isCameraRunning) {
            cancelAnimationFrame(this.requestAnimationId);
            this.requestAnimationId = null;
            return;
        }
        if (this.context) {
            this.context.drawImage(this.video, 0, 0, this.video.width, this.video.height);
        }
        await this.options.onFrame(this.video);
        this.requestAnimationId = requestAnimationFrame(() => {
            this.drawImageRAF();
        });
    }

    private drawImageST() {
        if (!this.isCameraRunning) {
            clearTimeout(this.setTimeoutHandler);
            this.setTimeoutHandler = null;
            return;
        }
        if (this.context) {
            this.context.drawImage(this.video, 0, 0, this.video.width, this.video.height);
        }
        this.options.onFrame(this.video);
        this.setTimeoutHandler = setTimeout(() => {
            this.drawImageST();
        }, 50);
    };

    public start() {
        this.video && this.video.play();
        if (this.requestAnimationId || this.setTimeoutHandler) {
            return;
        }
        this.isCameraRunning = true;
        this.visible = true;
        this.videoRequestAnimationFrame();
    }

    public pause() {
        this.video && this.video.pause();
        this.isCameraRunning = false;
        this.cancelDrawImage();
    }

    public switchCameras() {
        if (!this.isIOS && (!this.videoDevices || this.videoDevices.length < 2)) {
            return;
        }
        // 停止视频流播放
        this.stopMediaTracks();
        // 切换摄像头
        const current = this.currentMode;
        this.currentMode = current === 'user' ? 'environment' : 'user';
        const videoDeviceId = this.videoDeviceId;
        this.videoDeviceId = videoDeviceId === this.videoDevices[0]
            ? this.videoDevices[1]
            : this.videoDevices[0];
        // 重置视频流
        this.handleStream();
    }

    private cancelDrawImage() {
        clearTimeout(this.setTimeoutHandler);
        this.setTimeoutHandler = null;
        cancelAnimationFrame(this.requestAnimationId);
        this.requestAnimationId = null;
    }

    private registerVisiblityEvent() {
        document.addEventListener('visibilitychange', () => {
            if (!this.isCameraRunning) {
                return;
            }
            this.visible = document.visibilityState === 'visible';
            this.cancelDrawImage();
            if (this.visible) {
                this.drawImageRAF();
                return;
            }
            this.drawImageST();
        });
    }
}
