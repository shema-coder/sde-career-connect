from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ApplicationCreate(BaseModel):
    institution: str

    full_names: str
    gender: str

    province: str
    district: str
    sector: str
    cell: str
    village: str

    index_number: str
    national_id: str

    email: str
    phone: str
    date_of_birth: str
    trade_option: str

    disability: str
    disability_details: str | None = None

    refugee: str

    faculty1: str
    faculty2: str | None = None
    faculty3: str | None = None

    consent: bool


class ApplicationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    reference_code: str
    institution: str
    status: str
    public_message: str
    created_at: datetime
    updated_at: datetime


class ApplicationCreatedResponse(ApplicationResponse):
    tracking_pin: str

class AdminApplicationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    reference_code: str
    institution: str
    full_names: str
    gender: str
    province: str
    district: str
    sector: str
    cell: str
    village: str
    index_number: str
    national_id: str
    email: str
    phone: str
    date_of_birth: str
    trade_option: str
    disability: str
    disability_details: str | None = None
    refugee: str
    faculty1: str
    faculty2: str | None = None
    faculty3: str | None = None
    status: str
    public_message: str
    private_notes: str | None = None
    consent: bool
    created_at: datetime
    updated_at: datetime



class AdminApplicationUpdate(BaseModel):
    status: str
    public_message: str
    private_notes: str | None = None


class AdminLoginRequest(BaseModel):
    email: str
    password: str


class AdminLoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
