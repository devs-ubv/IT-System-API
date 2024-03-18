import { IRequest } from '../../interfaces/ProdutosInterface';
import { formatDate } from '../time';

export const fetchAllDataRequest = async (Request: IRequest[]) => {
  let requestResult = [];
  for (const [_, ct] of Request.entries()) {
    requestResult.push({
      id: ct._id,
      requestedBy: `${ct?.requestedBy.firstName} ${ct.requestedBy.surname}`,
      employee: `${ct?.employee?.firstName} ${ct?.employee?.surname}`,
      equipmentName: ct?.equipment.brand,
      equipmentCategory: ct?.equipment?.category?.categoryName,
      cover_url: ct?.equipment.cover_url,
      observation: ct?.observation,
      equipmentType: ct?.employee?.function,
      quantity: ct.quantity,
      active: ct.active,
      visible: ct.visible,
      received:ct.received,
      processing:ct.processing,
      updatedAt: ct.updatedAt,
      createdAt: formatDate(ct.createdAt),
    });
  }
  return requestResult;
};

export const responseDataRequest = (data: any, page: number) => {
  return {
    requests: data,
    currentPage: Number(page),
    hasMorePages: true,
    lastPage: Number(page),
    perPage: data.length,
    prevPageUrl: null,
    total: data.length,
  };
};