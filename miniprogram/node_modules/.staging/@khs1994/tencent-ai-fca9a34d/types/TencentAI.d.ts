import AbstractTencentAI from './AbstractTencentAI';
import NLP from './NLP';
import Face from './Face';
import Image from './Image';
import ImageSpecialEffects from './ImageSpecialEffects';
import OCR from './OCR';
import Person from './Person';
import Speech from './Speech';
import Translate from './Translate';
import TencentAIError from './Error/TencentAIError';
declare class TencentAI extends AbstractTencentAI {
    readonly nlp: NLP;
    readonly face: Face;
    readonly image: Image;
    readonly imageSpecialEffects: ImageSpecialEffects;
    readonly ocr: OCR;
    readonly person: Person;
    readonly speech: Speech;
    readonly translate: Translate;
}
export default TencentAI;
export { NLP, Face, Image, ImageSpecialEffects, OCR, Person, Speech, Translate, TencentAIError, TencentAI, };
