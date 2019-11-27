import TencentAIResult from '../../TencentAIResult';
interface FaceList {
    face_id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    gender: number;
    age: number;
    expression: number;
    beauty: number;
    glass: 0 | 1;
    pitch: number;
    yaw: number;
    roll: number;
    face_shape: {
        face_profile: Array<{
            x: number;
            y: number;
        }>;
        left_eye: Array<{
            x: number;
            y: number;
        }>;
        right_eye: Array<{
            x: number;
            y: number;
        }>;
        left_eyebrow: Array<{
            x: number;
            y: number;
        }>;
        right_eyebrow: Array<{
            x: number;
            y: number;
        }>;
        mouth: Array<{
            x: number;
            y: number;
        }>;
        mose: Array<{
            x: number;
            y: number;
        }>;
    };
}
export default interface Detectface extends TencentAIResult {
    ret: number;
    msg: string;
    data: {
        image_width: number;
        image_height: number;
        face_list: Array<FaceList>;
    };
}
export {};
